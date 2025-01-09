const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  logout,
  googleLogin,
  sendEmailOTP,
  verifyOTP,
  forgotPassword,
} = require('../controllers/authController');
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

router.post('/sendEmailOtp', sendEmailOTP);
router.post('/verifyOtp', verifyOTP);
router.post('/sendResetPasswordEmail', forgotPassword);

module.exports = router;
