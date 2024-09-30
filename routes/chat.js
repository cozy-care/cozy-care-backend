const express = require('express');
const {
  initiateChat,
  sendMessage,
  getMessages,
} = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/initiate', initiateChat);
router.post('/send', sendMessage);
router.get('/:chat_id', getMessages);

module.exports = router;
