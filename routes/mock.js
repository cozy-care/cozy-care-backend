const express = require('express');
const { mockupCaregiverMale, mockupCaregiverFemale, mockupClientMale, mockupClientFemale } = require('../controllers/mockController')
const router = express.Router();

router.post('/caregiver/male', mockupCaregiverMale);
router.post('/caregiver/female', mockupCaregiverFemale);
router.post('/client/male', mockupClientMale);
router.post('/client/female', mockupClientFemale);
module.exports = router;