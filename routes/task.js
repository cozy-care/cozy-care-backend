const express = require('express');
const { createTask, getTask, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();

router.post('/create', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
