const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

function createToken(user) {
  return jwt.sign(
    { user_id: user.user_id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

async function register(req, res) {
  const { username, password, email, role, firstname, middlename, lastname } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db('Users').insert({
      username,
      password: hashedPassword,
      email,
      role,
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await db('Users')
      .where({ username })
      .whereNull('deleted_at')
      .first();
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (user.google_id) {
      return res.status(400).json({ error: 'Please login with Google' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: 'Invalid password' });

    const token = createToken(user);
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
}

async function googleLogin(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const token = createToken(req.user);
  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
  res.redirect('http://localhost:3000/home');
  res.json({ message: 'Logged in successfully with google' });
}

function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

module.exports = { register, login, logout, googleLogin };
