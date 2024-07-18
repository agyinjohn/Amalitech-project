const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./utils/errorHandler");
const admin = require("firebase-admin");

require("dotenv").config();
// Initialize Firebase Admin SDK
const serviceAccount = require("./utils/config/firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

const router = require("./routes/authRoutes");
const Videorouter = require("./routes/videoRoute");

const app = express();

// Middlewares for security purposes
const allowedOrigins = [
  `${process.env.CLIENT_URL}`,
  "https://amalitech-bespoke.netlify.app",

  "http://localhost:5173",

  // Add any other allowed origins here
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if your request includes credentials
  })
);

app.use(express.json());
app.use(helmet());
app.use("/api", router);
app.use("/api/videos", Videorouter);
app.use(express.static(path.join(__dirname, "/public/dist")));

let DB_URL = process.env.MONGODB_URL.replace("<password>", process.env.DB_PASS);
mongoose
  .connect(DB_URL)
  .then((res) => console.log("Successful connection to database"))
  .catch((err) => {
    console.log("Connection failed");
  });

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.use(errorHandler);

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
