const db = require('../config/database');
const { io } = require('../server'); // Import io for broadcasting messages
const jwt = require('jsonwebtoken');

async function initiateChat(req, res) {
  const { user1_id, user2_id } = req.body;

  try {
    const user1 = await db('Users').where({ user_id: user1_id }).first();
    if (!user1) {
      return res
        .status(404)
        .json({ error: `User with ID ${user1_id} not found` });
    }

    const user2 = await db('Users').where({ user_id: user2_id }).first();
    if (!user2) {
      return res
        .status(404)
        .json({ error: `User with ID ${user2_id} not found` });
    }

    let chat = await db('Chat')
      .where(function () {
        this.where({ user1_id, user2_id }).orWhere({
          user1_id: user2_id,
          user2_id: user1_id,
        });
      })
      .first();

    if (chat) {
      return res.status(200).json({ chat_id: chat.chat_id });
    } else {
      const newChat = await db('Chat')
        .insert({ user1_id, user2_id })
        .returning('*');
      return res.status(201).json({ chat_id: newChat[0].chat_id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error initiating chat' });
  }
}

async function getChat(req, res) {

  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ error: 'No token found, authorization denied' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let userId;

    if (typeof decoded.user_id === 'string') {
      userId = decoded.user_id; // Directly use it if it's a string
    } else if (decoded.user_id && typeof decoded.user_id === 'object') {
      userId = decoded.user_id.user_id; // Extract from the object if it's an object
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid token: user_id not found' });
    }

    const chatIds = await db('Chat')
      .select('chat_id')
      .where('user1_id', userId)
      .orWhere('user2_id', userId);
    
    if (chatIds.length > 0) {
      res.status(200).json(chatIds);
    } else {
      res.status(404).json({ error: 'No chat IDs found for this user.' });
    }

  } catch (error) {
    console.error("Error fetching chat_id:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function sendMessage(req, res) {
  const { chat_id, sender_id, content } = req.body;

  try {
    // Insert the new message into the database
    const newMessage = await db('Message')
      .insert({
        chat_id,
        sender_id,
        content,
        sent_at: new Date(),
      })
      .returning('*');

    if (newMessage && newMessage.length > 0) {
      // Broadcast the message to all clients in the chat room using WebSocket
      req.io.to(chat_id).emit('message', newMessage[0]); // Use req.io to access Socket.io instance
    }

    // Return the newly created message in the response
    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message });
  }
}

async function getMessages(req, res) {
  const { chat_id } = req.params;

  try {
    const messages = await db('Message')
      .where({ chat_id })
      .orderBy('sent_at', 'asc');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
}

async function getLastMessageFromOther(req, res) {
  const { chat_id, user_id } = req.params;

  try {
    // Fetch all messages for the chat, ordered by sent_at in descending order
    const messages = await db('Message')
      .where({ chat_id })
      .orWhere('sender_id', user_id)
      .orderBy('sent_at', 'desc'); // Order by sent_at to get the latest first

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found in this chat' });
    }

    // Get the last message from the sorted list (first element after sorting by descending order)
    const lastMessage = messages[0]; 

    // Send back the last message along with sender check
    return res.status(200).json({
      lastMessageContent: lastMessage.content,
      lastMessageTime: lastMessage.sent_at,
    });
  } catch (error) {
    console.error('Error retrieving last message:', error);
    return res.status(500).json({ error: 'Error retrieving last message' });
  }
}

module.exports = { initiateChat, getChat, sendMessage, getMessages, getLastMessageFromOther };
