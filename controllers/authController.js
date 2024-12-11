const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../config/database');

// Function to create a JWT token
function createToken(user) {
  return jwt.sign(
    { user_id: user.user_id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    res.redirect(`${process.env.GOOGLE_REDIRECT_URL}`);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Logout function to clear the JWT token from cookies
async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

// Store OTP function
async function storeOTP(user_id, otp) {
  try {
    // Hash the OTP for secure storage
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Set expiration time (e.g., 5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Insert OTP details into the database
    await db('OtpRequest').insert({
      user_id,
      otp: hashedOTP,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    console.log(`OTP stored successfully for user_id: ${user_id}`);
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw new Error('Failed to store OTP');
  }
}

// Send Email OTP function
async function sendEmailOTP(req, res) {
  const { email, user_id } = req.body;
  const otp = generateOTP();

  const mailOptions = {
    from: process.env.EMAIL_2FA,
    to: email,
    subject: 'YOUR_COZYCARE_OTP',
    text: `รหัส OTP ของคุณคือ: ${otp}. ระยะเวลาหมดอายุ 5 นาที`,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
      user: process.env.EMAIL_2FA,
      pass: process.env.PASSWORD_2FA,
    },
  });

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    // Send OTP email
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent!');

    // Store OTP in the database
    await storeOTP(user_id, otp);
    console.log('OTP email store!');

    return res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return res.status(500).json({ error: 'Failed to send OTP.' });
  }
}

// Send SMS OTP function
// async function sendSMSOTP(req, res) {
//   const { user_id, phone } = req.body;
//   const otp = generateOTP();

//   if (!user_id || !phone) {
//     return res.status(400).json({ error: 'user_id and phone are required.' });
//   }

//   try {
//     const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

//     const message = await client.messages.create({
//       body: `This is Message from Cozy Care Your OTP is ${otp}`, // Message text
//       from: process.env.TWILIO_PHONE, // Twilio phone number
//       to: phone, // Recipient's number
//     });

//     console.log(`Message sent: ${message.sid}`);

//     await storeOTP(user_id, otp);
//     console.log('OTP sms store!');

//     return res.status(200).json({ success: true, messageSid: message.sid });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     return res.status(500).json({ error: 'Failed to send OTP.' });
//   }

// }

// Verify OTP function
async function verifyOTP(req, res) {
  const { user_id, otp } = req.body;

  if (!user_id || !otp) {
    return res.status(400).json({ error: 'UserID and OTP are required.' });
  }

  try {
    // Fetch the latest OTP record for the given email
    const record = await db('OtpRequest')
      .where({ user_id })
      .orderBy('created_at', 'desc') // Get the most recent OTP
      .first();

    // Check if a record exists
    if (!record) {
      return res.status(400).json({ error: 'No OTP found for this email.' });
    }

    // Check if the OTP has expired
    const isExpired = new Date() > new Date(record.expires_at);
    if (isExpired) {
      return res.status(400).json({ error: 'OTP has expired.' });
    }

    // Compare the provided OTP with the stored hashed OTP
    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    // Optionally, delete the used OTP after verification
    await db('OtpRequest').where({ otp_id: record.otp_id }).del();

    return res.status(200).json({ message: 'OTP verification successful!' });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = {
  register,
  login,
  logout,
  googleLogin,
  sendEmailOTP,
  verifyOTP,
};
