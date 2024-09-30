const db = require('../config/database');

async function initiateChat(req, res) {
  const { user1_id, user2_id } = req.body;

  try {
    // Check if user1_id exists in the database
    const user1 = await db('Users').where({ user_id: user1_id }).first();
    if (!user1) {
      return res
        .status(404)
        .json({ error: `User with ID ${user1_id} not found` });
    }

    // Check if user2_id exists in the database
    const user2 = await db('Users').where({ user_id: user2_id }).first();
    if (!user2) {
      return res
        .status(404)
        .json({ error: `User with ID ${user2_id} not found` });
    }

    // Check if a chat already exists between the two users
    let chat = await db('Chat')
      .where(function () {
        this.where({ user1_id, user2_id }).orWhere({
          user1_id: user2_id,
          user2_id: user1_id,
        });
      })
      .first();

    if (chat) {
      // If a chat already exists, return the existing chat_id
      return res.status(200).json({ chat_id: chat.chat_id });
    } else {
      // If no chat exists, create a new one where user1_id is the initiator
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

// Function to send a message in an existing chat
async function sendMessage(req, res) {
  const { chat_id, sender_id, content } = req.body;

  try {
    const message = await db('Message')
      .insert({
        chat_id,
        sender_id,
        content,
        sent_at: new Date(),
      })
      .returning('*');
    res.status(201).json(message[0]);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Error sending message' });
  }
}

// Function to retrieve all messages from a chat
async function getMessages(req, res) {
  const { chat_id } = req.params;

  try {
    const messages = await db('Message')
      .where({ chat_id })
      .orderBy('sent_at', 'asc');
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving messages' });
  }
}

module.exports = { initiateChat, sendMessage, getMessages };
