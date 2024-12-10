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

    // Insert patient record
    await db('Patient').insert({ user_id });

    return res.status(201).json({ message: 'Patient created successfully' });
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

async function createSubPatient(req, res) {
    
}

module.exports = { createPatient };
