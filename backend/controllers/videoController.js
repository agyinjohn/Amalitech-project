const Video = require("../models/videoModel");
const multer = require("multer");
const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin SDK
const serviceAccount = require("../utils/config/firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for video upload
exports.uploadVideo = [
  upload.single("video"),
  async (req, res, next) => {
    const { title, description } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).send("No video file uploaded");
    }

    const fileName = `videos/${Date.now()}_${path.basename(
      videoFile.originalname
    )}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: videoFile.mimetype, // Set content type to ensure proper handling
        metadata: {
          custom: {
            description: "Video uploaded via Node.js",
            title: title,
            customDescription: description,
          },
        },
      },
    });

    stream.on("error", (err) => {
      console.error(err);
      return res.status(500).send("Error uploading file to Firebase Storage");
    });

    stream.on("finish", async () => {
      try {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        const video = await Video.create({
          title,
          description,
          url: publicUrl,
        });
        res.status(201).json(video);
      } catch (err) {
        next(err); // Pass the error to the next middleware
      }
    });

    stream.end(videoFile.buffer);
  },
];

exports.streamVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id; // Get the video ID from the request parameters
    const video = await Video.findById(videoId); // Find the video in the database by ID

    if (!video) {
      return res.status(404).send("Video not found"); // Return 404 if the video is not found
    }
    const url = video.url.split("/").pop();
    const file = bucket.file(`videos/${url}`); // Get the file from the bucket using the URL
    if (!file) {
      return res.status(404).send("File not found");
    }
    let range = req.headers.range; // Get the range header from the request

    const [metadata] = await file.getMetadata();
    const fileSize = metadata.size;

    if (!range) {
      const defaultChunkSize = 10 ** 6; // 1MB
      range = `bytes=0-${defaultChunkSize - 1}`;
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);

    file
      .createReadStream({
        start,
        end,
      })
      .pipe(res);
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};

exports.listVideos = async (req, res, next) => {
  try {
    const videos = await Video.find();
    if (!videos.length) {
      return res.status(404).json({ message: "No videos found" });
    }
    res.status(200).json(videos);
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};
