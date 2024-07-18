// utils/firebaseAuth.js
const admin = require("firebase-admin");

async function generateCustomToken(uid, additionalClaims = {}) {
  try {
    const customToken = await admin
      .auth()
      .createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw new Error("Error creating custom token");
  }
}

module.exports = {
  generateCustomToken,
};
