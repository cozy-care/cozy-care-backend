const express = require('express');
const { createTask, getTask, updateTask, deleteTask, getTaskByUserAndOtherUser } = require('../controllers/taskController');
const router = express.Router();

router.post('/create', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/get-task', getTaskByUserAndOtherUser);

module.exports = router;
