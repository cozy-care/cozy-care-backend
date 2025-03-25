const db = require('../config/database');
const knex = require('../config/database'); // Assuming you have configured Knex.js

async function createCaregiver(req, res) {
    const {
        user_id,
        firstname,
        middlename,
        lastname,
        sex,
        birth_date,
        weight,
        height,
        used_language,
        experience,
        study_experience,
        certification_image,
        is_term
    } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const trx = await db.transaction();

    try {
        // อัปเดต role ของ user_id ใน Users table
        await trx('Users')
            .where({ user_id })
            .update({ role: 'caregiver' });

        // แทรกข้อมูลใหม่ลงใน Caregivers table
        await trx('Caregiver').insert({
            user_id,
            firstname,
            middlename,
            lastname,
            sex,
            birth_date,
            weight,
            height,
            used_language,
            experience,
            study_experience,
            certification_image,
            is_term
        });

        // Commit transaction หากไม่มีข้อผิดพลาด
        await trx.commit();
        res.status(201).json({ message: "Caregiver created successfully" });
    } catch (error) {
        await trx.rollback();
        console.error("Error creating caregiver:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function getCaregiverDetails(req, res) {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Query caregiver details from the Caregiver table
        const caregiver = await db('Caregiver')
            .where({ user_id })
            .first(); // Get only one record

        if (!caregiver) {
            return res.status(404).json({ message: "Caregiver not found" });
        }

        res.status(200).json(caregiver);
    } catch (error) {
        console.error("Error fetching caregiver details:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function updateCaregiverDetails(req, res) {
    const { user_id, ...updateFields } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Check if the caregiver exists
        const caregiverExists = await db('Caregiver')
            .where({ user_id })
            .first();

        if (!caregiverExists) {
            return res.status(404).json({ message: "Caregiver not found" });
        }

        // Update only the provided fields
        await db('Caregiver')
            .where({ user_id })
            .update(updateFields);

        res.status(200).json({ message: "Caregiver details updated successfully" });
    } catch (error) {
        console.error("Error updating caregiver details:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function getCaregiverIdByUserId(req, res) {
    const { user_id } = req.body;
    try {
        const caregiver = await knex('Caregiver')
        .select('caregiver_id')
        .where({ user_id })
        .first();

        res.status(200).json({ caregiver });
    } catch (error) {
        console.error('Error updating SubClient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { createCaregiver, getCaregiverDetails, updateCaregiverDetails, getCaregiverIdByUserId };
