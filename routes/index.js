const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const chatRoutes = require('./chat');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
