const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
// const crypto = require("crypto");
const router = require("./routes/authRoutes");
const Videorouter = require("./routes/videoRoute");
require("dotenv").config();

const app = express();
// const jwtSecret = crypto.randomBytes(64).toString("hex");
// console.log(jwtSecret);
//Middlewares for security purposes
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/api", router);
app.use("/api/videos", Videorouter);

let DB_URL = process.env.MONGODB_URL.replace("<password>", process.env.DB_PASS);
mongoose
  .connect(DB_URL)
  .then((res) => console.log("Successfull connection to database"))
  .catch((err) => {
    console.log("Connection faile");
  });
// DB_URL.users.getIndexes();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
