const express = require('express');
const router = express.Router();
const { getAllCaregiverOrder } = require('../controllers/orderController');

router.get('/caregiver', getAllCaregiverOrder);

module.exports = router;