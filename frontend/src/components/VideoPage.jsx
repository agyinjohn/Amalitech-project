import React, { useState, useEffect } from "react";
import logo from "../assets/Bespoke.png";
import { useParams, useNavigate } from "react-router-dom";
import VideoWidget from "./videoPlayer";

// const API_URL = "https://amalitech-project-6652.onrender.com/api/videos";
const API_URL = "http://localhost:8000/api/videos";
// http://localhost:8000/api/videos/stream/667bd16009ce84001ad8e4b3
function VideoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [Index, setIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [url, setUrl] = useState(`${API_URL}/stream/${id}`);

  useEffect(() => {
    // Check if videos are in local storage
    const storedVideos = localStorage.getItem("videos");
    if (storedVideos) {
      const parsedVideos = JSON.parse(storedVideos);
      setVideos(parsedVideos);
      setVideoIds(parsedVideos.map((video) => video._id));
    } else {
      fetchVideos();
    }
  }, []);

  useEffect(() => {
    setUrl(`${API_URL}/stream/${id}`);
    console.log(url);
    console.log(id);
    fetchVideos(); // Fetch videos from server on id change
  }, [id]);

  const fetchVideos = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/listVideos`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVideos(data);
          setVideoIds(data.map((video) => video._id));
          localStorage.setItem("videos", JSON.stringify(data)); // Update local storage with fetched data
        })
        .catch((error) => console.error("Error fetching video IDs:", error));
    } else {
      console.log("no token, 401");
    }
  };

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
    return <p>Loading....</p>;
  }

  return (
    <div className="video-content">
      <img src={logo} alt="Description" height="150px" width="150px" />
      <VideoWidget src={url} />
      <div className="des">
        <h1> {videos[Index]?.title} </h1>
        <p> {videos[Index]?.description} </p>
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
        <button onClick={() => copyToClipboard(videos[Index]?.url)}>
          Share
        </button>
      </div>
    </div>
  );
}

export default VideoPage;
