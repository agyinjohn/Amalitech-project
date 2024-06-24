import React, { useState, useEffect } from "react";
import axios from "axios";
import videoService from "../services/videoService";
const API_URL = "http://localhost:8000/api/videos";
function VideoPage() {
  const [video, setVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videosLength, setVideosLength] = useState(0);
  useEffect(() => {
    loadVideo(currentIndex);
  }, [currentIndex]);

  const loadVideo = async (index) => {
    axios
      .get(`${API_URL}/listVideos`)
      .then((res) => {
        console.log(res);
        const videos = res.data;
        setVideosLength(videos.length);
        if (videos.length > 0 && index >= 0 && index < videos.length) {
          setVideo(videos[index]);
          console.log(videos);
        } else {
          setVideo(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex(currentIndex - 1);
  };

  return (
    <div>
      {video ? (
        <div className="video-page">
          <header className="video-header">
            <img src="logo.png" alt="Business Logo" className="logo" />
          </header>
          <main className="video-container">
            <video controls className="video-player">
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-info">
              <h1>{video.title}</h1>
              <p>{video.description}</p>
            </div>
            <div className="video-controls">
              {currentIndex > 0 && (
                <button onClick={handlePrevious}>Previous</button>
              )}
              {currentIndex < videosLength && (
                <button onClick={handleNext}>Next</button>
              )}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
              >
                Share
              </button>
            </div>
          </main>
        </div>
      ) : (
        <p>No video available</p>
      )}
    </div>
  );
}

export default VideoPage;
