const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");
const moment = require("moment");
const jwt = require("jsonwebtoken");

/**
 * Configures Passport to use Google OAuth 2.0 for authentication.
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/v0/auth/google/callback",
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(
        "------------------------profile:------------------",
        profile
      );
      const profileData = {
        googleId: profile.id,
        email: profile.emails[0].value,
        imagePath: profile.photos[0].value,
        name: profile.displayName,
        familyName: profile.name.familyName,
      };
      console.log("profileData:", profileData); // Log the profile data
      try {
        let user = await User.findOne({
          "email.primary": profileData.email,
        });

        console.log("user%%%%%%%%%%%%%%%:", user.name); // Log the user data
        const playload = {
          exp: moment()
            .add(process.env.JWT_EXPIRATION_MINUTES, "minutes")
            .unix(),
          iat: moment().unix(),
          sub: user._id,
        };
        const access = jwt.sign(playload, process.env.JWT_TOKEN_SECRET);
        if (!user.googleAuth) {
          user.googleAuth = {};
        }
        user.googleAuth.accessToken = access;
        await user.save();
        console.log("user://////////////////", user); // Log the user data
        return done(null, user);
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
