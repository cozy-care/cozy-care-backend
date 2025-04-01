const knex = require('../config/database'); // Assuming you have configured Knex.js

async function createSubClient(req, res) {
    const {
        user_id,
        firstname,
        middlename,
        lastname,
        profile_image,
        sex,
        birth_date,
        weight,
        height,
        client_type,
        phy_con,
        con_dis,
        drug_all,
        drug_used,
        is_term
    } = req.body;

    // Start a transaction
    const trx = await knex.transaction();

    try {
        // Step 1: Update the role in the User table to "client"
        await trx('Users')
            .where({ user_id })
            .update({ role: 'client' });

        // Step 2: ตรวจสอบว่ามี client_id ใน Client Table หรือยัง
        let client = await trx('Client')
            .select('client_id')
            .where({ user_id })
            .first();

        let client_id;

        if (!client) {
            // ถ้ายังไม่มี client_id → ให้สร้างใหม่
            const [newClient] = await trx('Client')
                .insert({ user_id })
                .returning('client_id'); // PostgreSQL returns the inserted ID

            client_id = newClient.client_id; // Extract client_id ใหม่
        } else {
            // ถ้ามี client_id อยู่แล้ว → ใช้ client_id เดิม
            client_id = client.client_id;
        }

        // Step 3: Insert ข้อมูลลงใน SubClient Table
        await trx('SubClient').insert({
            client_id,
            firstname,
            middlename,
            lastname,
            profile_image,
            sex,
            birth_date,
            weight,
            height,
            client_type,
            phy_con,
            con_dis,
            drug_all,
            drug_used,
            is_term
        });

        // Commit the transaction
        await trx.commit();

        // ส่ง response กลับ
        res.status(201).json({ message: 'SubClient created successfully', client_id });
    } catch (error) {
        // Rollback the transaction ถ้ามี error
        await trx.rollback();
        console.error('Error creating SubClient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSubClient(req, res) {
    const { user_id } = req.body; // รับ user_id จาก request body

    try {
        // ค้นหา client_id จากตาราง Client โดยใช้ user_id
        const client = await knex('Client')
            .select('client_id')
            .where({ user_id })
            .first(); // ใช้ .first() เพื่อให้ได้แค่ Object เดียว (ถ้ามี)

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const client_id = client.client_id; // ดึงค่า client_id ออกมา

        // ใช้ client_id ไป query หาข้อมูลทั้งหมดของ SubClient
        const subClients = await knex('SubClient')
            .select('*')
            .where({ client_id });

        // ส่งข้อมูลกลับ
        res.status(200).json({ subClients });
    } catch (error) {
        console.error('Error fetching SubClient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function delSubClient(req, res) {
    const { sub_client_id } = req.body; // รับ sub_client_id จาก request body

    try {
        // ตรวจสอบว่า sub_client_id ถูกส่งมาหรือไม่
        if (!sub_client_id) {
            return res.status(400).json({ error: 'sub_client_id is required' });
        }

        // ค้นหา sub_client_id ในตาราง SubClient
        const subClient = await knex('SubClient')
            .where({ sub_client_id })
            .first();

        if (!subClient) {
            return res.status(404).json({ error: 'SubClient not found' });
        }

        // ลบข้อมูล SubClient ที่มี sub_client_id ตรงกัน
        await knex('SubClient')
            .where({ sub_client_id })
            .del();

        // ส่ง response กลับ
        res.status(200).json({ message: 'SubClient deleted successfully' });
    } catch (error) {
        console.error('Error deleting SubClient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSubClientDetail(req, res) {
    const { sub_client_id } = req.body; // รับ sub_client_id จาก request body

    try {
        // ตรวจสอบว่ามีการส่ง sub_client_id มาหรือไม่
        if (!sub_client_id) {
            return res.status(400).json({ error: 'sub_client_id is required' });
        }

        // ค้นหาข้อมูลของ SubClient จาก SubClient Table
        const subClient = await knex('SubClient')
            .select('*')
            .where({ sub_client_id })
            .first(); // ใช้ .first() เพื่อให้ได้ Object เดียว (ถ้ามี)

        // ถ้าไม่พบข้อมูล ให้ส่ง error 404
        if (!subClient) {
            return res.status(404).json({ error: 'SubClient not found' });
        }

        // ส่งข้อมูลกลับ
        res.status(200).json({ subClient });
    } catch (error) {
        console.error('Error fetching SubClient details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updateSubClientDetail(req, res) {
    const { sub_client_id } = req.body; // รับ sub_client_id จาก request body
    const updatedData = req.body; // ข้อมูลที่ต้องการอัปเดต

    try {
        // ตรวจสอบว่า sub_client_id ถูกส่งมาหรือไม่
        if (!sub_client_id) {
            return res.status(400).json({ error: 'sub_client_id is required' });
        }

        // ตรวจสอบว่า sub_client_id มีอยู่ในฐานข้อมูลหรือไม่
        const subClient = await knex('SubClient')
            .where({ sub_client_id })
            .first();

        if (!subClient) {
            return res.status(404).json({ error: 'SubClient not found' });
        }

        // ลบ sub_client_id ออกจาก updatedData เพื่อป้องกันการอัปเดตค่าหลักโดยไม่ตั้งใจ
        delete updatedData.sub_client_id;

        // อัปเดตข้อมูล SubClient ในฐานข้อมูล
        await knex('SubClient')
            .where({ sub_client_id })
            .update(updatedData);

        // ส่ง response กลับ
        res.status(200).json({ message: 'SubClient updated successfully' });
    } catch (error) {
        console.error('Error updating SubClient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getClientIdByUserId(req, res) {
    const { user_id } = req.body;
    try {
        const client = await knex('Client')
        .select('client_id')
        .where({ user_id })
        .first();

        res.status(200).json({ client });
    } catch (error) {
        console.error('Error updating SubClient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { createSubClient, getSubClient, delSubClient, getSubClientDetail, updateSubClientDetail, getClientIdByUserId };