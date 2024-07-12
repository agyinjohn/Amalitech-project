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
const corsOptions = {
  origin: "https://6690b9a8e471f9c7493fb8c4--cute-cuchufli-b9e947.netlify.app", // Allow both ports
  methods: ["GET", "POST"], // Allowed methods
  allowedHeaders: ["Content-Type"], // Allowed headers
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
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
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
