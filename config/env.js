const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.API_PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
