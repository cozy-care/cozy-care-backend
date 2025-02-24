const express = require('express');
const { createSubClient } = require('../controllers/clientController');

const router = express.Router();

router.post('/create-sub-client', createSubClient);

module.exports = router;
