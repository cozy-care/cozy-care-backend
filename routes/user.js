const express = require('express');
const getLoggedInUserData = require('../controllers/userController');

const router = express.Router();

router.get('/me', getLoggedInUserData);

module.exports = router;