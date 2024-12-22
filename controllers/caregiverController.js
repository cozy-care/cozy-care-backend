const db = require('../config/database');

async function getAllCaregiver(req, res) {
    try {
        // Query to fetch all caregivers and their associated user details
        const caregivers = await db('Caregiver')
            .join('Users', 'Caregiver.user_id', '=', 'Users.user_id')
            .select(
                'Caregiver.caregiver_id',
                'Caregiver.firstname',
                'Caregiver.lastname',
                'Caregiver.middlename',
                'Caregiver.sex',
                'Caregiver.birth_date',
                'Caregiver.weight',
                'Caregiver.height',
                'Caregiver.province',
                'Caregiver.district',
                'Caregiver.sub_district',
                'Caregiver.experience',
                'Caregiver.expert',
                'Caregiver.certification_image',
                'Caregiver.used_language',
                'Caregiver.is_approve',
                'Caregiver.available_time',
                'Users.username',
                'Users.email',
                'Users.alias'
            );

        // Check if there are any caregivers in the database
        if (!caregivers || caregivers.length === 0) {
            return res.status(404).json({ error: 'No caregivers found' });
        }

        // Return the list of caregivers
        return res.status(200).json(caregivers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

module.exports = { getAllCaregiver };
