const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');  // Import the cors package
const apiRoutes = require('./routes/index');
const passport = require('./config/passport');

dotenv.config();
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,  // Replace with your client's origin
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));  // Use CORS with specified options

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
