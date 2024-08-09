const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const apiRoutes = require('./routes/index');
const passport = require('./config/passport');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRoutes);

const port = process.env.API_PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
