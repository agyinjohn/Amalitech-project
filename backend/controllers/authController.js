const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/mailer");

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "Please this email address is in use by another account",
      });
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    sendVerificationEmail(user.email, token);
    res.status(201).json({
      message: "User registered. Please check your email for verification.",
    });
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};

exports.verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(400).json({
            error:
              "Token has expired. Please request a new verification email.",
          });
        }
        return res.status(400).json({ error: "Invalid token." });
      }

      const update = {
        isVerified: true,
      };
      const options = {
        new: true, // Return the updated document
        runValidators: true, // Run validation on the update
      };

      const user = await User.findByIdAndUpdate(decoded.id, update, options);
      if (!user) throw new Error("User not found.");

      res.status(200).json({ message: "Email verified successfully" });
    });
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};

exports.resetPasswordRequest = async (req, res, next) => {
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
    next(err); // Pass the error to the next middleware
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Invalid token");
    if (await user.matchPassword(password))
      return res.status(400).json({
        message: "Updated password cannot be equal to the old password",
      });
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};
