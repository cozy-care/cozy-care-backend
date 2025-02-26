const express = require('express');
const { createCaregiver, getCaregiverDetails, updateCaregiverDetails } = require('../controllers/caregiverController');
const router = express.Router();

router.post('/create-caregiver', createCaregiver)
router.post('/get-caregiver-details', getCaregiverDetails)
router.put('/update-caregiver-details', updateCaregiverDetails)
module.exports = router;
