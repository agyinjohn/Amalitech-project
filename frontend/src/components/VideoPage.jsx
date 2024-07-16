import React, { useState, useEffect } from "react";
import logo from "../assets/Bespoke.png";
import { useParams, useNavigate } from "react-router-dom";
const API_URL = "https://amalitech-project-6652.onrender.com/api/videos";

function VideoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [index, setIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const fetchVideo = async (videoId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://amalitech-project-6652.onrender.com/api/videos/stream/${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch video");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    // Fetch the list of all video IDs
    const token = localStorage.getItem("token");
    if (token) {
      fetch(
        "https://amalitech-project-6652.onrender.com/api/videos/listVideos",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setVideos(data);
          setVideoIds(data.map((video) => video._id));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching video IDs:", error);
          setIsLoading(false);
        });
    }
  }, []); // Empty dependency array ensures this runs only once after initial render

  useEffect(() => {
    const fetchAndSetVideo = async () => {
      try {
        const videoUrl = await fetchVideo(id);
        setVideoSrc(videoUrl);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    if (id) {
      fetchAndSetVideo();
    }
  }, [id]);

  const handleNext = () => {
    const currentIndex = videoIds.indexOf(id);
    setIndex(currentIndex);
    if (currentIndex !== -1 && currentIndex < videoIds.length - 1) {
      navigate(`/videos/video/${videoIds[currentIndex + 1]}`);
    }
  };

  const handlePrevious = () => {
    const currentIndex = videoIds.indexOf(id);
    setIndex(currentIndex);
    if (currentIndex > 0) {
      navigate(`/videos/video/${videoIds[currentIndex - 1]}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  if (isLoading) {
    return (
      <div className="loading-indicator">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="video-content">
      <img src={logo} alt="Description" height="150px" width="150px" />
      <video controls src={videoSrc} style={{ width: "100%", height: "auto" }}>
        Your browser does not support the video tag.
      </video>
      <div className="des">
        <h1>{videos[index]?.title}</h1>
        <p>{videos[index]?.description}</p>
      </div>
      <div>
        {videoIds.indexOf(id) > 0 && (
          <button
            onClick={handlePrevious}
            disabled={videoIds.indexOf(id) === 0}
          >
            Previous
          </button>
        )}
        {videoIds.indexOf(id) < videoIds.length - 1 && (
          <button
            onClick={handleNext}
            disabled={videoIds.indexOf(id) === videoIds.length - 1}
          >
            Next
          </button>
        )}
        <button onClick={() => copyToClipboard(videos[index]?.url)}>
          Share
        </button>
      </div>
    </div>
  );
}

export default VideoPage;
