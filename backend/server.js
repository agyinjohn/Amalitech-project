const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "env" });
const app = express();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
