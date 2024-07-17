const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./utils/errorHandler");

// const crypto = require("crypto");
const router = require("./routes/authRoutes");
const Videorouter = require("./routes/videoRoute");
require("dotenv").config();
const app = express();

// const jwtSecret = crypto.randomBytes(64).toString("hex");
// console.log(jwtSecret);
//Middlewares for security purposes
const allowedOrigins = [
  "https://6690b9a8e471f9c7493fb8c4--cute-cuchufli-b9e947.netlify.app",
  "https://66969e37c89110de29a269ea--cute-cuchufli-b9e947.netlify.app",
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
  .then((res) => console.log("Successfull connection to database"))
  .catch((err) => {
    console.log("Connection failed");
  });
// DB_URL.users.getIndexes();

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.use(errorHandler);
const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
