const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/mailer/mailer.utils");
const User = require("../models/user");

/**
 * Generates a random token.
 *
 * @returns {string} - Returns a randomly generated token.
 */
function generateToken() {
  const tokenLength = 20;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";

  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
}

/**
 * Handles password reset request.
 *
 * @param {Object} req - The request object containing user email.
 * @param {Object} res - The response object for sending HTTP responses.
 */
async function requestPasswordReset(req, res) {
  const { email } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ "email.primary": email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a password reset token
    const resetToken = generateToken();

    // Save the reset token to the user's document
    user.resetToken = resetToken;
    await user.save();

    // Send the password reset email
    const resetLink = `${process.env.URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      "Password Reset Request",
      `Click the following link to reset your password: ${resetLink}`,
      `<p>Click the following link to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`
    );

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Handles email verification request.
 *
 * @param {Object} req - The request object containing user email.
 * @param {Object} res - The response object for sending HTTP responses.
 */
async function requestEmailVerification(req, res) {
  const { email } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ "email.primary": email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.status) {
        return res.status(400).json({ message: "User already verified" });
      }
  

    // Generate a verification token
    const verificationToken = generateToken();

    // Save the verification token to the user's document
    user.verificationToken = verificationToken;
    await user.save();

    // Send the verification email
    const verificationLink = `${process.env.URL}/users/verify-email/${verificationToken}`;
    await sendEmail(
      email,
      "Email Verification Request",
      `Click the following link to verify your email address: ${verificationLink}`,
      `<p>Click the following link to verify your email address:</p><p><a href="${verificationLink}">Verify Email</a></p>`
    );

    res.status(200).json({ message: "Email verification email sent successfully" });
  } catch (error) {
    console.error("Error requesting email verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Handles email verification.
 *
 * @param {Object} req - The request object containing verification token.
 * @param {Object} res - The response object for sending HTTP responses.
 */
async function verifyEmail(req, res) {
  const { token } = req.params;

  try {
    // Find the user with the provided verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "User not found or verification token invalid" });
    }

    // Update user's status to verified
    user.status = "verified";
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  requestPasswordReset,
  requestEmailVerification,
  verifyEmail,
};
