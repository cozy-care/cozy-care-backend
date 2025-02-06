const express = require('express');
const router = express.Router();
const { getAllCaregiverOrder, getAllClientOrder } = require('../controllers/orderController');

router.get('/caregiver', getAllCaregiverOrder);
router.get('/client', getAllClientOrder);

module.exports = router;