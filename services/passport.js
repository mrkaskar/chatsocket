const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook');
const keys = require("../config/keys");
const mongoose = require('mongoose');
// const FacebookStrategy = require("passport-facebook");
const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

  passport.use(
      new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
          console.log(accessToken)
        const existingUser = await User.findOne({ login_id: profile.id });
  
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await new User({
          login_id: profile.id,
          name:profile.displayName,
          pic:profile.photos[0].value
        }).save();
        done(null, user);
      }
    )
  );

  passport.use(
    new FacebookStrategy({
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: "/auth/facebook/callback",
      proxy: true,
      enableProof: true,
      profileFields: ['id', 'displayName', 'photos', 'email']

    },
    async (accessToken, refreshToken, profile, done) => {

      const existingUser = await User.findOne({ login_id: profile.id });
  
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await new User({
          login_id: profile.id,
          name:profile.displayName,
          pic:profile.photos[0].value
        }).save();
        done(null, user);
    }
  )
)