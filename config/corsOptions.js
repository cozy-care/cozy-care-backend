const { CLIENT_URL } = require('./env');

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true, // Allow cookies to be sent with requests
};

module.exports = corsOptions;
