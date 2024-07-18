import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const res = await axios.get(
        "https://amalitech-project-6652.onrender.com/api/videos/listVideos",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      const videos = res.data;
      localStorage.setItem("videos", JSON.stringify(videos)); // Store the video data in local storage
      setId(videos[currentIndex]["_id"]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [currentIndex]);

  if (isLoading) {
    return <h1>Loading......</h1>;
  }

  return (
    <div>
      <div className="landing">
        <main className="landing-main">
          <h1>Welcome to Bespoke Video Platform</h1>
        </main>
        <div className="content-l">
          <p>Your go-to place for exclusive videos.</p>
          <Link
            onClick={() => console.log("click")}
            to={`/videos/video/${id}`}
            className="button"
          >
            Watch videos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
