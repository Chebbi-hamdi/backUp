const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const FacebookStrategy = require("passport-facebook").Strategy;
/**
 * Configures Passport to use Google OAuth 2.0 for authentication.
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/public/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          "email.primary": profile.emails[0].value,
        });

        if (user) {
          return done(null, user);
        }

        user = new User({
          googleId: profile.id,
          "email.primary": profile.emails[0].value,
          authType: "google",
        });
        await user.save();

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
/**
 * Serializes user object into the session.
 */

passport.serializeUser((user, done) => {
  done(null, user.id);
});
/**
 * Deserializes user object from the session.
 */

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
/**
 * Configures Passport to use Facebook OAuth 2.0 for authentication.
 */

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/public/auth/facebook/callback",
      profileFields: ["id", "emails", "name"], 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          "email.primary": profile.emails[0].value,
        });

        if (user) {
          return done(null, user);
        }

        user = new User({
          facebookId: profile.id,
          "email.primary": profile.emails[0].value,
          authType: "facebook",
        });

        await user.save();

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
