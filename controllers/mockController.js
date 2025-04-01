const { caregiverMockup, clientMockup } = require('./mockData');

async function mockupCaregiverMale(req, res) {
    const { count } = req.body;

    if (!count || isNaN(count) || count <= 0) {
        return res.status(400).json({ error: 'Provide a positive integer count for male caregivers.' });
    }

    try {
        const insertedCount = await caregiverMockup(count, 'male');
        return res.status(201).json({ message: `${insertedCount} male caregivers inserted successfully.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

async function mockupCaregiverFemale(req, res) {
    const { count } = req.body;

    if (!count || isNaN(count) || count <= 0) {
        return res.status(400).json({ error: 'Provide a positive integer count for female caregivers.' });
    }

    try {
        const insertedCount = await caregiverMockup(count, 'female');
        return res.status(201).json({ message: `${insertedCount} female caregivers inserted successfully.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

async function mockupClientMale(req, res) {
    const { count } = req.body;

    if (!count || isNaN(count) || count <= 0) {
        return res.status(400).json({ error: 'Provide a positive integer count for male clients.' });
    }

    try {
        const insertedCount = await clientMockup(count, 'male');
        return res.status(201).json({ message: `${insertedCount} male clients inserted successfully.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

async function mockupClientFemale(req, res) {
    const { count } = req.body;

    if (!count || isNaN(count) || count <= 0) {
        return res.status(400).json({ error: 'Provide a positive integer count for female clients.' });
    }

    try {
        const insertedCount = await clientMockup(count, 'female');
        return res.status(201).json({ message: `${insertedCount} female clients inserted successfully.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

module.exports = { mockupCaregiverMale, mockupCaregiverFemale, mockupClientMale, mockupClientFemale };