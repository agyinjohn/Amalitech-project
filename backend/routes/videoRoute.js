const express = require("express");
const {
  uploadVideo,
  streamVideo,
  listVideos,
} = require("../controllers/videoController");
const { protect, admin } = require("../utils/middlewares/authmiddleware");

const Videorouter = express.Router();

Videorouter.post("/upload", protect, admin, uploadVideo);
Videorouter.get("/stream/:id", protect, streamVideo);
Videorouter.get("/listVideos", protect, listVideos);

module.exports = Videorouter;
