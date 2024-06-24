const Video = require("../models/videoModel");
const multer = require("multer");
const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin SDK
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

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
  async (req, res) => {
    const { title, description } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).send("No video file uploaded");
    }

    const fileName = `videos/${Date.now()}_${path.basename(
      videoFile.originalname
    )}`;
    const file = bucket.file(fileName);

    // const stream = file.createWriteStream({
    //   metadata: {
    //     contentType: videoFile.mimetype,
    //   },
    // });
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
        console.error(err);
        res.status(500).send("Error saving video data to database");
      }
    });

    stream.end(videoFile.buffer);
  },
];

// Controller function to stream video
// exports.streamVideo = async (req, res) => {
//   try {
//     const videoId = req.params.id; // Get the video ID from the request parameters
//     const video = await Video.findById(videoId); // Find the video in the database by ID

//     if (!video) {
//       return res.status(404).send("Video not found"); // Return 404 if the video is not found
//     }

//     const file = bucket.file(video.url.split("/").pop()); // Get the file from the bucket using the URL
//     console.log(file);
//     // Get metadata for the file to determine its size
//     file
//       .getMetadata()
//       .then((data) => {
//         const fileSize = data[0].size; // Get the file size from the metadata
//         const range = req.headers.range; // Get the range header from the request

//         if (!range) {
//           return res.status(400).send("Requires Range header"); // Return 400 if range header is missing
//         }

//         const CHUNK_SIZE = 10 ** 6; // Set chunk size to 1MB
//         const start = Number(range.replace(/\D/g, "")); // Get the start byte from the range header
//         const end = Math.min(start + CHUNK_SIZE, fileSize - 1); // Calculate the end byte

//         const contentLength = end - start + 1; // Calculate the content length
//         const headers = {
//           "Content-Range": `bytes ${start}-${end}/${fileSize}`, // Set the Content-Range header
//           "Accept-Ranges": "bytes", // Indicate that bytes can be requested
//           "Content-Length": contentLength, // Set the content length
//           "Content-Type": "video/mp4", // Set the content type to video/mp4
//         };

//         res.writeHead(206, headers); // Write the headers with status 206 (Partial Content)

//         const stream = file.createReadStream({
//           start, // Start byte
//           end, // End byte
//         });

//         stream.pipe(res); // Pipe the stream to the response
//       })
//       .catch((err) => {
//         // console.error(err);
//         res.status(500).send("Error retrieving video metadata"); // Return 500 if there is an error retrieving metadata
//       });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error"); // Return 500 if there is a server error
//   }
// };

exports.streamVideo = async (req, res) => {
  try {
    const videoId = req.params.id; // Get the video ID from the request parameters
    const video = await Video.findById(videoId); // Find the video in the database by ID

    if (!video) {
      return res.status(404).send("Video not found"); // Return 404 if the video is not found
    }
    const url = video.url.split("/").pop();
    // console.log(url);
    const file = bucket.file(`videos/${url}`); // Get the file from the bucket using the URL
    if (!file) {
      console.log(url);
      return res.status(404).send("file not found");
    }
    const range = req.headers.range; // Get the range header from the request

    if (!range) {
      return res.status(400).send("Requires Range header"); // Return 400 if range header is missing
    }

    const CHUNK_SIZE = 10 ** 6; // Set chunk size to 1MB
    const start = Number(range.replace(/\D/g, "")); // Get the start byte from the range header
    const end = start + CHUNK_SIZE; // Calculate the end byte

    const stream = file.createReadStream({
      start, // Start byte
      end, // End byte
    });

    const headers = {
      "Content-Range": `bytes ${start}-${end}/*`, // Set the Content-Range header with wildcard for total length
      "Accept-Ranges": "bytes", // Indicate that bytes can be requested
      "Content-Type": "video/mp4", // Set the content type to video/mp4
    };

    res.writeHead(206, headers); // Write the headers with status 206 (Partial Content)
    stream.pipe(res); // Pipe the stream to the response

    // stream.on("error", (err) => {
    //   console.error(err);
    //   return res
    //     .status(500)
    //     .send("Error streaming video from Firebase Storage");
    // });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error"); // Return 500 if there is a server error
  }
};

exports.listVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    if (!videos.length) {
      return res.status(404).json({ message: "No videos found" });
    }
    res.status(200).json(videos);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving videos", error: err.message });
  }
};
