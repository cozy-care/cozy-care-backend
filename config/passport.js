const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await db('Users').where({ google_id: profile.id }).first();
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        if (!user) {
          // Register new user
          const newUser = {
            username: profile.emails[0].value,
            email: profile.emails[0].value,
            google_id: profile.id,
            role: 'user',
            alias: `${firstName} ${lastName}`.trim(),
          };
          const [userId] = await db('Users')
            .insert(newUser)
            .returning('user_id');
          user = { ...newUser, user_id: userId };
        }


        return done(null, user);
      } catch (error) {
        console.error('Error in GoogleStrategy:', error); // Log the error
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {

  if (user && user.user_id) {
    done(null, user.user_id);
  } else {
    done(new Error('User ID is not defined'), null);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const userId = typeof id === 'object' && id.user_id ? id.user_id : id;

    const user = await db('Users').where({ user_id: userId }).first();
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    console.error('Error during deserialization:', error); // Log the error
    done(error, null);
  }
});

module.exports = passport;
