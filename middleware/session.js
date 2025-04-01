const session = require('express-session');
const { SESSION_SECRET } = require('../config/env');

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

module.exports = sessionMiddleware;
