const passport = require('passport');
const keys = require('../config/keys');

const User = require('../models/userModel');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      existingUser = await User.findOne({ googleID: profile.id });

      if (existingUser) {
        // we have record.
        console.log('hey bro, welcome back!');
        done(null, existingUser);
      } else {
        // we don't have record
        console.log(profile);
        const newUser = await User.create({
          name: profile.displayName,
          thumbnail: profile._json.picture,
          email: profile._json.email.split(',')[0],
          googleID: profile.id
        });
        console.log('This is our User :D ... ',newUser);
        done(null, newUser);
      }

      console.log('access Token:', accessToken);
      console.log('refresh Token', refreshToken);
      console.log('profile:', profile);
    }
  )
);
