const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Function to create a JWT token
function createToken(user) {
  return jwt.sign(
    { user_id: user.user_id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

// Register function to create a new user in the Users table
async function register(req, res) {
  const { username, password, email, role, alias } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    await db('Users').insert({
      username,
      password: hashedPassword,
      email,
      role,
      alias, // Include alias in the new schema
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Error registering user' });
  }
}

// Login function to authenticate users based on username and password
async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Find the user in the database by username, ignoring those with deleted_at set
    const user = await db('Users')
      .where({ username })
      .whereNull('deleted_at') // Ensure the account isn't soft deleted
      .first();

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // If the user has a Google ID, they should log in via Google
    if (user.google_id) {
      return res.status(400).json({ error: 'Please login with Google' });
    }

    // Validate the provided password against the stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate a JWT token and send it as a cookie
    const token = createToken(user);
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
}

// Google login function to authenticate users via Google
async function googleLogin(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  try {
    // Create a token for the authenticated user
    const token = createToken(req.user);
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    // Redirect or send JSON response (avoid doing both)
    res.redirect('http://gold39.ce.kmitl.ac.th/home');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Logout function to clear the JWT token from cookies
function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

module.exports = { register, login, logout, googleLogin };
