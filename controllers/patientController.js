const db = require('../config/database');
const jwt = require('jsonwebtoken');

async function createPatient(req, res) {
    const token = req.cookies.token;
  
    // Check for token
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Extract user_id and role
      let user_id;
  
      if (typeof decoded.user_id === 'string') {
        user_id = decoded.user_id;
      } else if (decoded.user_id && typeof decoded.user_id === 'object') {
        user_id = decoded.user_id.user_id;
      } else {
        return res.status(400).json({ error: 'Invalid token: user_id and role not found' });
      }
  
      // Fetch role from the database using user_id
      const user = await db('Users') // Replace 'Users' with your actual users table name
        .select('role')
        .where({ user_id })
        .first();
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const role = user.role;
  
      // Check if role is 'patient'
      if (role !== 'patient') {
        return res.status(403).json({ error: 'Only patients can create a record' });
      }
  
      // Check if patient already exists
      const existingPatient = await db('Patient').where({ user_id }).first();
      if (existingPatient) {
        return res.status(400).json({ error: 'Patient already exists' });
      }
  
      // Extract values from req.body
      const {
        firstname,
        middlename,
        lastname,
        profile_image,
        sex,
        birth_date,
        weight,
        height,
        province,
        district,
        sub_district,
        type,
        con_disease,
        drug_allegry,
        drug_used,
        is_bedridden,
        is_feed,
        available_time,
      } = req.body;
  
      // Start a transaction for atomicity
      await db.transaction(async (trx) => {
        // Insert patient record and get the patient_id
        const [patient] = await trx('Patient').insert({ user_id }).returning('patient_id');

        const patient_id = patient.patient_id;
        console.log(patient_id);
  
        // Insert a SubPatient record using the new patient_id and req.body data
        await trx('SubPatient').insert({
          patient_id,
          firstname,
          middlename,
          lastname,
          profile_image,
          sex,
          birth_date,
          weight,
          height,
          province,
          district,
          sub_district,
          type,
          con_disease,
          drug_allegry,
          drug_used,
          is_bedridden,
          is_feed,
          available_time,
        });
      });
  
      return res.status(201).json({ message: 'Patient and SubPatient created successfully' });
    } catch (error) {
      console.error(error);
  
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
  
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getAllPatient(req, res) {
    try {
        // Query to fetch all patients and their associated details
        const patients = await db('Patient')
            .join('SubPatient', 'Patient.patient_id', '=', 'SubPatient.patient_id')
            .select(
                'Patient.patient_id',
                'SubPatient.firstname',
                'SubPatient.middlename',
                'SubPatient.lastname',
                'SubPatient.profile_image',
                'SubPatient.sex',
                'SubPatient.birth_date',
                'SubPatient.weight',
                'SubPatient.height',
                'SubPatient.province',
                'SubPatient.district',
                'SubPatient.sub_district',
                'SubPatient.type',
                'SubPatient.con_disease',
                'SubPatient.drug_allegry',
                'SubPatient.drug_used',
                'SubPatient.is_bedridden',
                'SubPatient.is_feed',
                'SubPatient.available_time'
            );

        // Check if there are any patients in the database
        if (!patients || patients.length === 0) {
            return res.status(404).json({ error: 'No patients found' });
        }

        // Format available_time to YYYY-MM-DD
        const formattedPatients = patients.map((patient) => ({
            ...patient,
            available_time: patient.available_time
                ? new Date(patient.available_time).toISOString().split('T')[0]
                : null,
        }));

        // Return the list of patients
        return res.status(200).json(formattedPatients);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

module.exports = { createPatient, getAllPatient };
