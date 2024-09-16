const jwt = require('jsonwebtoken');
const db = require('../config/database');

async function getLoggedInUserData(req, res) {
  // Get the token from the cookies
  const token = req.cookies.token;

  // If no token is found, return an error
  if (!token) {
    return res.status(401).json({ error: 'No token found, authorization denied' });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user ID from the decoded token
    const userId = decoded.user_id;

    // Query the Users table to get the user data by ID
    const user = await db('Users')
      .where({ user_id: userId })
      .whereNull('deleted_at')
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Exclude sensitive information such as password
    const { password, ...userData } = user;

    // Return the user data
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user data' });
  }
}


module.exports = getLoggedInUserData;
