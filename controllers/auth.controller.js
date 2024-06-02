const { generateJWT,enableAccJWT } = require("../utils/jwt.utils");
const asyncHandler = require("express-async-handler");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");
const jwt = require("../utils/jwt.utils");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const User = require("../models/user");
const { getName } = require("country-list");
// const passport = require("../middlewares/passport");

/**
 * Handles user registration.
 *
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending HTTP responses.
 * @returns {Object} - Returns a JWT token upon successful registration.
 */

const signUp = async (req, res) => {
  try {
    const userInfo = req.body;

    const geo = geoip.lookup(userInfo.ip);
    if (
      !(
        // userInfo &&
        userInfo.password &&
        userInfo.email.primary &&
        userInfo.name &&
        userInfo.familyName
      )
    ) {
      throw createError(400, `Missing information!`);
    }

    const similarUser = await User.findOne({
      "email.primary": userInfo.email.primary.toLowerCase(),
    });
    if (similarUser) {
      throw createError(401, `User with same Email already exists!`);
    }

    const hash = await bcrypt.hash(userInfo.password, 10);

    userInfo.password = hash;
    // userInfo.authType = "local";

    userInfo.email.primary = userInfo.email.primary.toLowerCase();
    // userInfo.status = "unverified";
    // userInfo.address = getName(geo.country);

    let user = await User.create(userInfo);

    // Send mail to verify account

    const token = enableAccJWT(userInfo);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
/**
 * Handles user login.
 *
 * @param {Object} req - The request object containing user login information.
 * @param {Object} res - The response object for sending HTTP responses.
 * @returns {Object} - Returns a JWT token upon successful login.
 */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Email and password are required");
    }

    const user = await User.findOne({ "email.primary": email.toLowerCase() });

    if (!user) {
      throw createError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createError(401, "Invalid email or password");
    }

    user.last_access_date = new Date();
    await user.save();

    const token = generateJWT(user);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
};
/**
 * Initiates Google login.
 */

// const googleLogin = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });
// /**
//  * Callback for Google login.
//  */

// const googleCallback = passport.authenticate("google", {
//   failureRedirect: "/login",
// });
/**
 * Handles successful Google login.
 *
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending HTTP responses.
 */

// const handleGoogleSuccess = (req, res) => {
//   const token = generateJWT(req.user);
//   res.status(200).json({ token });
// };
/**
 * Initiates Facebook login.
 */

// const facebookLogin = passport.authenticate("facebook", { scope: ["email"] });
/**
 * Callback for Facebook login.
 */

// const facebookCallback = passport.authenticate("facebook", {
//   failureRedirect: "/login",
// });
// /**
/*
 * Handles successful Facebook login.
 *
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending HTTP responses.
 */

const handleFacebookSuccess = (req, res) => {
  const token = generateJWT(req.user);
  res.status(200).json({ token });
};

module.exports = {
  signUp,
  login,
  // googleLogin,
  // googleCallback,
  // handleGoogleSuccess,
  // facebookLogin,
  // facebookCallback,
  // handleFacebookSuccess,
};
