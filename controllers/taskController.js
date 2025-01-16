const db = require('../config/database');
const { format } = require('date-fns');

// Create Task
async function createTask(req, res) {
    const { caregiver_id, sub_patient_id, task_status, start_time, end_time } = req.body;

    if (!caregiver_id || !sub_patient_id || !task_status || !start_time || !end_time) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        await db('Task').insert({
            caregiver_id,
            sub_patient_id,
            task_status,
            start_time,
            end_time
        });
        return res.status(201).json({ message: 'Task created successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create task.' });
    }
}

// Get Task
async function getTask(req, res) {

    try {
        const task = await db('Task').where({ task_id: req.params.id }).first();

        if (!task) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        const formattedTask = {
            ...task,
            start_time: format(new Date(task.start_time), 'dd-MM-yyyy HH:mm:ss'),
            end_time: format(new Date(task.end_time), 'dd-MM-yyyy HH:mm:ss'),
        };

        return res.status(200).json(formattedTask);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve task.' });
    }
}

// Update Task
async function updateTask(req, res) {
    const { caregiver_id, sub_patient_id, task_status, start_time, end_time } = req.body;

    if (!caregiver_id || !sub_patient_id || !task_status || !start_time || !end_time) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const updatedRows = await db('Task').where({ task_id: req.params.id }).update({
            caregiver_id,
            sub_patient_id,
            task_status,
            start_time,
            end_time
        });

        if (!updatedRows) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        return res.status(200).json({ message: 'Task updated successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update task.' });
    }
}

// Delete Task
async function deleteTask(req, res) {

    try {
        const deletedRows = await db('Task').where({ task_id: req.params.id }).del();

        if (!deletedRows) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        return res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete task.' });
    }
}

module.exports = {
    createTask,
    getTask,
    updateTask,
    deleteTask
};
