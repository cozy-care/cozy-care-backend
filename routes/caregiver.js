const express = require('express');
const { createCaregiver, getCaregiverDetails, updateCaregiverDetails, getCaregiverIdByUserId } = require('../controllers/caregiverController');
const router = express.Router();

router.post('/create-caregiver', createCaregiver)
router.post('/get-caregiver-details', getCaregiverDetails)
router.post('/get-caregiver-id', getCaregiverIdByUserId)
router.put('/update-caregiver-details', updateCaregiverDetails)
module.exports = router;
