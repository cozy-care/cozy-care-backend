const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const chatRoutes = require('./chat');
const multer = require('multer');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/chat', chatRoutes);

// Define multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/var/www/uploads'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload route
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
