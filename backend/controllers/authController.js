const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/mailer");

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({
        message: "Please this email address is in use by another account",
      });
    const user = User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    sendVerificationEmail(user.email, token);
    res.status(201).json({
      message: "User registered. Please check your email for verification.",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const upadate = {
      isVerified: true,
    };
    const options = {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the update
    };

    const user = await User.findByIdAndUpdate(decoded.id, upadate, options);
    if (!user) throw new Error("Invalid token");

    console.log(user);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new Error("Invalid email or password");
    }
    if (!user.isVerified) {
      throw new Error("Email not verified");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    sendResetPasswordEmail(user.email, token);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Invalid token");
    if (await user.matchPassword(password))
      return res.json({
        message: "Updated password cannot be equal the old password",
      });
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
