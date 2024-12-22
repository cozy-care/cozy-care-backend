const express = require('express');
const { getAllCaregiver } = require('../controllers/caregiverController');
const router = express.Router();

router.get('/all', getAllCaregiver)
module.exports = router;
