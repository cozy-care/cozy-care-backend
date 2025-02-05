const db = require('../config/database');

async function getAllCaregiverOrder(req, res) {
    try {
        // Query to fetch all caregiver orders and their associated caregiver details
        const caregiverOrders = await db('CaregiverOrder')
            .join('Caregiver', 'CaregiverOrder.caregiver_id', '=', 'Caregiver.caregiver_id')
            .select(
                'Caregiver.user_id',
                'Caregiver.firstname',
                'Caregiver.middlename',
                'Caregiver.lastname',
                'Caregiver.sex',
                'Caregiver.birth_date',
                'Caregiver.weight',
                'Caregiver.height',
                'Caregiver.used_language',
                'Caregiver.experience',
                'Caregiver.study_experience',
                'CaregiverOrder.address',
                'CaregiverOrder.geocode',
                'CaregiverOrder.want_client_type',
                'CaregiverOrder.payment_type',
                'CaregiverOrder.price',
                'CaregiverOrder.more_skill',
                'CaregiverOrder.start_time',
                'CaregiverOrder.end_time'
            );

        // Check if there are any caregiver orders in the database
        if (!caregiverOrders || caregiverOrders.length === 0) {
            return res.status(404).json({ error: 'No caregiver orders found' });
        }

        // Format the start_time and end_time to YYYY-MM-DD
        const formattedCaregiverOrders = caregiverOrders.map((order) => ({
            ...order,
            start_time: order.start_time
                ? new Date(order.start_time).toISOString().split('T')[0]
                : null,
            end_time: order.end_time
                ? new Date(order.end_time).toISOString().split('T')[0]
                : null,
        }));

        // Return the list of caregiver orders
        return res.status(200).json(formattedCaregiverOrders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

module.exports = { getAllCaregiverOrder };