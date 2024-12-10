const express = require('express');
const { createPatient, } = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authenticateToken, createPatient)

module.exports = router;
