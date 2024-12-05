const express = require('express');
const {
  initiateChat,
  getChat,
  sendMessage,
  getMessages,
  getLastMessageFromOther
} = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/initiate', initiateChat);
router.get('/me', authenticateToken, getChat);
router.post('/send', sendMessage);
router.get('/:chat_id', getMessages);
router.get('/:chat_id/lastMessage/:user_id', getLastMessageFromOther)

module.exports = router;
