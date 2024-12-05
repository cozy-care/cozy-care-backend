const express = require('express');
const {
  getLoggedInUserData,
  editUserData,
  getOtherUserDataByChatId,
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticateToken, getLoggedInUserData);
router.put('/me', authenticateToken, editUserData);
router.get('/getOtherBychatId/:chat_id', authenticateToken, getOtherUserDataByChatId);

module.exports = router;
