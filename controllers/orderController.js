const dayjs = require('dayjs');
const buddhistEra = require('dayjs/plugin/buddhistEra'); // Plugin for Buddhist calendar
const db = require('../config/database');

require('dayjs/locale/th'); // Load Thai locale
dayjs.extend(buddhistEra);
dayjs.locale('th');

const FIXED_LAT = 13.726725;
const FIXED_LON = 100.780125;

// Function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

async function getAllCaregiverOrder(req, res) {
    try {
        // Query to fetch all caregiver orders, their associated caregiver details, and user profile image
        const caregiverOrders = await db('CaregiverOrder')
            .join('Caregiver', 'CaregiverOrder.caregiver_id', '=', 'Caregiver.caregiver_id')
            .join('Users', 'Caregiver.user_id', '=', 'Users.user_id')
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
                'CaregiverOrder.end_time',
                'Users.profile_image'
            );

        if (!caregiverOrders || caregiverOrders.length === 0) {
            return res.status(404).json({ error: 'No caregiver orders found' });
        }

        const formatThaiDateStart = (date) => {
            if (!date) return null;
            return dayjs(date).format('D MMM');
        };

        const formatThaiDateEnd = (date) => {
            if (!date) return null;
            return dayjs(date).format('D MMM BBBB');
        };
        
        const formattedCaregiverOrders = caregiverOrders.map((order) => {
            let startTime = formatThaiDateStart(order.start_time);
            let endTime = formatThaiDateEnd(order.end_time);

            let distance = null;
            if (order.geocode) {
                const [lat, lon] = order.geocode.split(',').map(Number);
                if (!isNaN(lat) && !isNaN(lon)) {
                    distance = calculateDistance(FIXED_LAT, FIXED_LON, lat, lon).toFixed(2);
                }
            }

            // Format height and weight to two decimal places
            const formattedHeight = parseFloat(order.height).toFixed(2);
            const formattedWeight = parseFloat(order.weight).toFixed(2);

            // Format price as "price บาท / payment_type"
            const formattedPrice = `${order.price} บาท / ${order.payment_type}`;

            return {
                ...order,
                start_time: startTime,
                end_time: endTime,
                available_time: startTime && endTime ? `${startTime} - ${endTime}` : null,
                distance_km: distance ? `${distance}` : 'Unknown',
                height: formattedHeight,
                weight: formattedWeight,
                price: formattedPrice,
            };
        });

        return res.status(200).json(formattedCaregiverOrders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

async function getAllClientOrder(req, res) {
    try {
        // Query to fetch all client orders, their associated client details, and user profile image
        const clientOrders = await db('ClientOrder')
            .join('SubClient', 'ClientOrder.sub_client_id', '=', 'SubClient.sub_client_id')
            .join('Client', 'SubClient.client_id', '=', 'Client.client_id')
            .join('Users', 'Client.user_id', '=', 'Users.user_id')
            .select(
                'Client.user_id',
                'SubClient.firstname',
                'SubClient.middlename',
                'SubClient.lastname',
                'SubClient.sex',
                'SubClient.birth_date',
                'SubClient.weight',
                'SubClient.height',
                'SubClient.client_type',
                'SubClient.phy_con',
                'SubClient.con_dis',
                'SubClient.drug_all',
                'SubClient.drug_used',
                'ClientOrder.address',
                'ClientOrder.geocode',
                'ClientOrder.want_language',
                'ClientOrder.payment_type',
                'ClientOrder.price',
                'ClientOrder.want_ext_skill',
                'ClientOrder.more_addition',
                'ClientOrder.start_time',
                'ClientOrder.end_time',
                'Users.profile_image'
            );

        if (!clientOrders || clientOrders.length === 0) {
            return res.status(404).json({ error: 'No client orders found' });
        }

        const formatThaiDateStart = (date) => {
            if (!date) return null;
            return dayjs(date).format('D MMM');
        };

        const formatThaiDateEnd = (date) => {
            if (!date) return null;
            return dayjs(date).format('D MMM BBBB');
        };

        const formattedClientOrders = clientOrders.map((order) => {
            let startTime = formatThaiDateStart(order.start_time);
            let endTime = formatThaiDateEnd(order.end_time);

            let distance = null;
            if (order.geocode) {
                const [lat, lon] = order.geocode.split(',').map(Number);
                if (!isNaN(lat) && !isNaN(lon)) {
                    distance = calculateDistance(FIXED_LAT, FIXED_LON, lat, lon).toFixed(2);
                }
            }

            // Format height and weight to two decimal places
            const formattedHeight = parseFloat(order.height).toFixed(2);
            const formattedWeight = parseFloat(order.weight).toFixed(2);

            // Format price as "price บาท / payment_type"
            const formattedPrice = `${order.price} บาท / ${order.payment_type}`;

            return {
                ...order,
                start_time: startTime,
                end_time: endTime,
                available_time: startTime && endTime ? `${startTime} - ${endTime}` : null,
                distance_km: distance ? `${distance}` : 'Unknown',
                height: formattedHeight,
                weight: formattedWeight,
                price: formattedPrice,
            };
        });

        return res.status(200).json(formattedClientOrders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

module.exports = { getAllCaregiverOrder, getAllClientOrder };
