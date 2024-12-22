const express = require('express');
const { createPatient, getAllPatient } = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authenticateToken, createPatient)
router.get('/all', getAllPatient)
module.exports = router;
