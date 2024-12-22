const express = require('express');
const { insertMockCaregiversAndPatients } = require('../controllers/mockController')
const router = express.Router();

router.post('/insert', insertMockCaregiversAndPatients);
module.exports = router;