const db = require('../config/database');
const { format } = require('date-fns');

// Create Task
async function createTask(req, res) {
    try {
        const { user_id, other_user_id, task_title, task_status, start_time, end_time } = req.body;

        if (!user_id || !other_user_id || !task_title || !task_status || !start_time || !end_time) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Step 1: Fetch caregiver_id from Caregiver table using other_user_id
        const caregiver = await db('Caregiver')
            .where({ user_id: other_user_id }) // Find caregiver by user_id (chat participant)
            .select('caregiver_id')
            .first();

        if (!caregiver) {
            return res.status(404).json({ error: "Caregiver not found." });
        }

        const caregiver_id = caregiver.caregiver_id;

        // Step 2: Fetch client_id from Client table using user_id
        const client = await db('Client')
            .where({ user_id })
            .select('client_id')
            .first();

        if (!client) {
            return res.status(404).json({ error: "Client not found." });
        }

        const client_id = client.client_id;

        // Step 3: Fetch first sub_client_id from SubClient table using client_id
        const subClient = await db('SubClient')
            .where({ client_id })
            .select('sub_client_id')
            .first();

        if (!subClient) {
            return res.status(404).json({ error: "No sub_client found for this client." });
        }

        const sub_client_id = subClient.sub_client_id;

        // Step 4: Insert task into Task table
        await db('Task').insert({
            caregiver_id,
            sub_client_id,
            task_title,
            task_status,
            start_time,
            end_time
        });

        return res.status(201).json({ message: "Task created successfully." });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ error: "Failed to create task." });
    }
}

// Get Task
async function getTask(req, res) {
    try {
        const task = await db('Task').where({ task_id: req.params.id }).first();

        if (!task) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        // Ensure valid date formatting
        const formattedTask = {
            ...task,
            start_time: task.start_time ? format(new Date(task.start_time), 'dd-MM-yyyy HH:mm:ss') : null,
            end_time: task.end_time ? format(new Date(task.end_time), 'dd-MM-yyyy HH:mm:ss') : null,
        };

        return res.status(200).json(formattedTask);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve task.' });
    }
}


// Update Task (สามารถอัปเดตเฉพาะฟิลด์ที่ต้องการ)
async function updateTask(req, res) {
    try {
        const { id } = req.params; // รับ task_id จาก URL
        const updateData = req.body; // รับข้อมูลที่ต้องการอัปเดตจาก Body

        if (!id) {
            return res.status(400).json({ error: 'Task ID is required.' });
        }

        // **กรองเฉพาะฟิลด์ที่มีค่า ไม่อัปเดตฟิลด์ที่เป็น undefined หรือ null**
        const updateFields = Object.entries(updateData).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        // อัปเดตข้อมูลเฉพาะฟิลด์ที่มีค่า
        const updatedRows = await db('Task').where({ task_id: id }).update(updateFields);

        if (!updatedRows) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        return res.status(200).json({ 
            message: 'Task updated successfully.', 
            updatedFields: updateFields // ✅ แก้ไขชื่อตัวแปรให้ตรงกัน
        });

    } catch (error) {
        console.error("❌ Error updating task:", error);
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

// Get Task by user_id and other_user_id
async function getTaskByUserAndOtherUser(req, res) {
    try {
        const { user_id, other_user_id } = req.body;

        if (!user_id || !other_user_id) {
            return res.status(400).json({ error: "user_id and other_user_id are required." });
        }

        // **Step 1: ตรวจสอบว่า `user_id` เป็น Caregiver หรือ Client**
        const user = await db("Users")
            .where({ user_id })
            .select("role") // role: "caregiver" หรือ "client"
            .first();

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        let caregiver_id, sub_client_id;

        if (user.role === "caregiver") {
            // ถ้าเป็น Caregiver ให้ใช้ user_id -> caregiver_id
            caregiver_id = await db("Caregiver")
                .where({ user_id })
                .select("caregiver_id")
                .first();
            
            if (!caregiver_id) {
                return res.status(404).json({ error: "Caregiver not found." });
            }
            
            caregiver_id = caregiver_id.caregiver_id;

            // หา sub_client_id จากอีกฝั่ง (Client)
            const subClient = await db("SubClient")
                .join("Client", "SubClient.client_id", "=", "Client.client_id")
                .where("Client.user_id", other_user_id)
                .select("SubClient.sub_client_id")
                .first();

            if (!subClient) {
                return res.status(404).json({ error: "No sub_client found for this client." });
            }

            sub_client_id = subClient.sub_client_id;

        } else {
            // ถ้าเป็น Client ให้ใช้ user_id -> sub_client_id
            const subClient = await db("SubClient")
                .join("Client", "SubClient.client_id", "=", "Client.client_id")
                .where("Client.user_id", user_id)
                .select("SubClient.sub_client_id")
                .first();

            if (!subClient) {
                return res.status(404).json({ error: "No sub_client found for this client." });
            }

            sub_client_id = subClient.sub_client_id;

            // หา caregiver_id จากอีกฝั่ง (Caregiver)
            caregiver_id = await db("Caregiver")
                .where({ user_id: other_user_id })
                .select("caregiver_id")
                .first();

            if (!caregiver_id) {
                return res.status(404).json({ error: "Caregiver not found." });
            }

            caregiver_id = caregiver_id.caregiver_id;
        }

        // **Step 2: Query Task ด้วย caregiver_id & sub_client_id**
        const task = await db("Task")
            .where({ caregiver_id, sub_client_id })
            .select("task_status", "start_time", "end_time", "task_id")
            .first();

        if (!task) {
            return res.status(404).json({ error: "No task found for this user and caregiver." });
        }

        return res.status(200).json({ 
            task_id: task.task_id,
            task_status: task.task_status, 
            start_time: task.start_time, 
            end_time: task.end_time 
        });

    } catch (error) {
        console.error("❌ Error fetching task:", error);
        return res.status(500).json({ error: "Failed to fetch task." });
    }
}


module.exports = {
    createTask,
    getTask,
    updateTask,
    deleteTask,
    getTaskByUserAndOtherUser
};
