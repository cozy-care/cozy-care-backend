const express = require('express');
const router = express.Router();
const { getAllCaregiverOrder, getAllClientOrder, createCaregiverOrder } = require('../controllers/orderController');

router.get('/caregiver', getAllCaregiverOrder);
router.get('/client', getAllClientOrder);
router.post('/create-caregiver-order', createCaregiverOrder);

module.exports = router;