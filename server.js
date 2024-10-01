const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const apiRoutes = require('./routes/index');
const passport = require('./config/passport');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.CLIENT_URL } });

const corsOptions = {
  origin: process.env.CLIENT_URL, // Replace with your client's origin
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', (req, res, next) => {
  req.io = io; // Make io accessible in routes
  next();
}, apiRoutes);

// WebSocket connections
io.on('connection', (socket) => {
  socket.on('joinChat', (chat_id) => {
    socket.join(chat_id);
    console.log(`User joined chat: ${chat_id}`);
  });

  socket.on('sendMessage', (message) => {
    io.to(message.chat_id).emit('message', message); // Broadcast the message to all clients in the chat
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.API_PORT;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { io }; // Export io for use in other files if needed
