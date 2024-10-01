const db = require('../config/database');
const { io } = require('../server'); // Import io for broadcasting messages

async function initiateChat(req, res) {
  const { user1_id, user2_id } = req.body;

  try {
    const user1 = await db('Users').where({ user_id: user1_id }).first();
    if (!user1) {
      return res.status(404).json({ error: `User with ID ${user1_id} not found` });
    }

    const user2 = await db('Users').where({ user_id: user2_id }).first();
    if (!user2) {
      return res.status(404).json({ error: `User with ID ${user2_id} not found` });
    }

    let chat = await db('Chat')
      .where(function () {
        this.where({ user1_id, user2_id }).orWhere({ user1_id: user2_id, user2_id: user1_id });
      })
      .first();

    if (chat) {
      return res.status(200).json({ chat_id: chat.chat_id });
    } else {
      const newChat = await db('Chat').insert({ user1_id, user2_id }).returning('*');
      return res.status(201).json({ chat_id: newChat[0].chat_id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error initiating chat' });
  }
}

async function sendMessage(req, res) {
  const { chat_id, sender_id, content } = req.body;

  try {
    // Insert the new message into the database
    const newMessage = await db('Message').insert({
      chat_id,
      sender_id,
      content,
      sent_at: new Date(),
    }).returning('*');

    if (newMessage && newMessage.length > 0) {
      // Broadcast the message to all clients in the chat room using WebSocket
      req.io.to(chat_id).emit('message', newMessage[0]);  // Use req.io to access Socket.io instance
    }

    // Return the newly created message in the response
    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

async function getMessages(req, res) {
  const { chat_id } = req.params;

  try {
    const messages = await db('Message').where({ chat_id }).orderBy('sent_at', 'asc');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
}

module.exports = { initiateChat, sendMessage, getMessages };
