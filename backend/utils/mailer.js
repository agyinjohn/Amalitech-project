const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS, // App password generated in Gmail
  },
});

exports.sendVerificationEmail = (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Email Verification",
    html: `<h1>Email Verification</h1><p>Please click the link below to verify your email:</p><a href="${url}">${url}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
  });
};

exports.sendResetPasswordEmail = (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Password Reset",
    html: `<h1>Password Reset</h1><p>Please click the link below to reset your password:</p><a href="${url}">${url}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
  });
};

// apiKey: "AIzaSyD3SMqd8fut_xkXDFzFp7wsHHcPNDqdf-E",
// authDomain: "amalitech-project.firebaseapp.com",
// projectId: "amalitech-project",
// storageBucket: "amalitech-project.appspot.com",
// messagingSenderId: "353310696964",
// appId: "1:353310696964:web:77d90e821667be0a01b751"
