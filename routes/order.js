const express = require('express');
const router = express.Router();
const { getAllCaregiverOrder, getAllClientOrder, createCaregiverOrder, getCaregiverOrderByFilter } = require('../controllers/orderController');

router.get('/caregiver', getAllCaregiverOrder);
router.get('/client', getAllClientOrder);
router.post('/create-caregiver-order', createCaregiverOrder);
router.post('/get-caregiver-order-by-filter', getCaregiverOrderByFilter);

module.exports = router;