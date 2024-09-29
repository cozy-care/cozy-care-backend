const express = require('express');
const {
  getLoggedInUserData,
  editUserData,
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticateToken, getLoggedInUserData);
router.put('/me', authenticateToken, editUserData);

module.exports = router;
