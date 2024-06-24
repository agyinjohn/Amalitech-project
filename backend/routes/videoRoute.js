const express = require("express");
const {
  uploadVideo,
  streamVideo,
  listVideos,
} = require("../controllers/videoController");

const Videorouter = express.Router();

Videorouter.post("/upload", uploadVideo);
Videorouter.get("/stream/:id", streamVideo);
Videorouter.get("/listVideos", listVideos);
module.exports = Videorouter;
