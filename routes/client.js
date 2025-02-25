const express = require('express');
const { createSubClient, getSubClient, delSubClient, getSubClientDetail, updateSubClientDetail } = require('../controllers/clientController');

const router = express.Router();

router.post('/create-sub-client', createSubClient);
router.post('/get-sub-client', getSubClient);
router.post('/delete-sub-client', delSubClient);
router.post('/get-sub-client-details', getSubClientDetail);
router.put('/update-sub-client-details', updateSubClientDetail)

module.exports = router;
