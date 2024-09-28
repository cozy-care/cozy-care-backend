const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  logout,
  googleLogin,
} = require('../controllers/authController');
const getLoggedInUserData = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleLogin,
);

module.exports = router;
