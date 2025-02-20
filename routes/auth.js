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

router.get('/login', (req, res) => {
  const message = req.session.messages?.pop(); // Get the message from Passport
  res.render('login', { message });
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=This email is used for normal login. Please use normal login.`, failureMessage: true}),
  googleLogin,
);

router.post('/sendEmailOtp', sendEmailOTP);
router.post('/verifyOtp', verifyOTP);
router.post('/sendResetPasswordEmail', forgotPassword);

module.exports = router;
