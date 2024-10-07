const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const apiRoutes = require('./routes/index');
const passportMiddleware = require('./middleware/passport');
const sessionMiddleware = require('./middleware/session');
const corsOptions = require('./config/corsOptions');
const chatSocket = require('./sockets/chat');
const { PORT } = require('./config/env');
const path = require('path');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: corsOptions.origin } });

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

// Passport setup
passportMiddleware(app);

// Serve static files (for uploaded images)
app.use('/uploads', express.static('/var/www/uploads'));

// Make io accessible in routes
app.use('/api', (req, res, next) => {
  req.io = io;
  next();
}, apiRoutes);

// WebSocket setup
chatSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { io };
