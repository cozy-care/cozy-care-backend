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

        if (!user) {
          // Register new user
          const newUser = {
            username: profile.emails[0].value,
            email: profile.emails[0].value,
            google_id: profile.id,
            role: 'user',
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
          };
          const [userId] = await db('Users')
            .insert(newUser)
            .returning('user_id');
          user = { ...newUser, user_id: userId };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db('Users').where({ user_id: id }).first();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
