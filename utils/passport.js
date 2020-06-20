const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const { log } = console;

const User = require('../models/userModel');

passport.serializeUser(function(user, done) {
  log('Hello from Serilize :-* ');
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  User.findById(_id).then(userFromPassport => {
    log('Hello from DeSerilize, the added parameter is:-* ', userFromPassport);
    done(null, userFromPassport);
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
      log('Here is the PROFILE received from Google:', profile);
      existingUser = await User.findOne({ email: profile._json.email });

      if (existingUser) {
        // we have record.
        log('hey bro, welcome back! We are in existing User Passport.js');
        done(null, existingUser);
      } else {
        log('I am in ELSE :-o :-D');
        // we don't have record
        const newUser = await User.create({
          name: profile._json.name,
          email: profile._json.email,
          photoWeb: profile._json.picture,
          googleID: profile._json.sub
        });
        log('This is our User :D ... ', newUser);
        done(null, newUser);
      }
    }

    // log('access Token:', accessToken);
    // log('refresh Token', refreshToken);
    // log('profile:', profile);
    // }
  )
);
