const passport = require('../config/passport');

const passportMiddleware = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = passportMiddleware;
