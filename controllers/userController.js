const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { format } = require('date-fns');

async function getLoggedInUserData(req, res) {
  // Get the token from the cookies
  const token = req.cookies.token;

  // If no token is found, return an error
  if (!token) {
    return res
      .status(401)
      .json({ error: 'No token found, authorization denied' });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user ID from the decoded token
    let userId;

    if (typeof decoded.user_id === 'string') {
      userId = decoded.user_id; // Directly use it if it's a string
    } else if (decoded.user_id && typeof decoded.user_id === 'object') {
      userId = decoded.user_id.user_id; // Extract from the object if it's an object
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid token: user_id not found' });
    }

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
    console.log(error);
    res.status(500).json({ error: 'Error retrieving user data' });
  }
}

async function editUserData(req, res) {
  // Get the token from the cookies
  const token = req.cookies.token;

  // If no token is found, return an error
  if (!token) {
    return res
      .status(401)
      .json({ error: 'No token found, authorization denied' });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user ID from the decoded token
    let userId;

    if (typeof decoded.user_id === 'string') {
      userId = decoded.user_id; // Directly use it if it's a string
    } else if (decoded.user_id && typeof decoded.user_id === 'object') {
      userId = decoded.user_id.user_id; // Extract from the object if it's an object
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid token: user_id not found' });
    }

    // Get the data to update from the request body
    const { username, email, role, alias, profile_image, phone } = req.body;

    if (username) {
      return res.status(400).json({ error: 'Username cannot be changed' });
    }

    // Build the update object dynamically, excluding undefined fields
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (alias !== undefined) updateData.alias = alias;
    if (role !== undefined) updateData.role = role;
    if (profile_image !== undefined) updateData.profile_image = profile_image;
    if (phone !== undefined) updateData.phone = phone;

    // Add update_time to the update data
    updateData.updated_at = new Date();

    // Update the user data in the database
    // After the user is updated and before formatting
    const updatedUser = await db('Users')
      .where({ user_id: userId })
      .whereNull('deleted_at')
      .update(updateData, [
        'email',
        'role',
        'alias',
        'profile_image',
        'phone',
        'updated_at',
      ]); // Specify fields to return

    // If no user is updated, return 404
    if (!updatedUser || !updatedUser[0]) {
      return res
        .status(404)
        .json({ error: 'User not found or no changes made' });
    }

    // Access the updated_at value
    const updatedAt = updatedUser[0].updated_at; // Access the first element since we used returning array

    if (!updatedAt) {
      return res
        .status(500)
        .json({ error: 'Updated timestamp is not available' });
    }

    // Check if updatedAt is a Date object or a string and format it accordingly
    const formattedUpdatedAt = format(
      new Date(updatedAt),
      'dd-MM-yyyy HH:mm:ss',
    );

    // Return the updated user data with formatted updated_at
    res.status(200).json({
      ...updatedUser[0], // Spread the first object from the returned array
      updated_at: formattedUpdatedAt, // Replace with the formatted time
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error updating user data' });
  }
}

module.exports = { getLoggedInUserData, editUserData };
