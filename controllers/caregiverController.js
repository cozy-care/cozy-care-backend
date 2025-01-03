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
                'Users.user_id',
                'Users.profile_image',
                'Users.username',
                'Users.email',
                'Users.alias'
            );

        // Check if there are any caregivers in the database
        if (!caregivers || caregivers.length === 0) {
            return res.status(404).json({ error: 'No caregivers found' });
        }

        // Format available_time to YYYY-MM-DD
        const formattedCaregivers = caregivers.map((caregiver) => ({
            ...caregiver,
            available_time: caregiver.available_time
                ? new Date(caregiver.available_time).toISOString().split('T')[0]
                : null, // Ensure null is returned if no available_time
        }));

        // Return the list of caregivers
        return res.status(200).json(formattedCaregivers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

module.exports = { getAllCaregiver };
