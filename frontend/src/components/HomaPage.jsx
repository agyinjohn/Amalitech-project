import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
const HomaPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/videos/listVideos")
      .then((res) => setId(res.data[currentIndex]["_id"]))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <div className="landing">
        <main className="landing-main">
          <h1>Welcome to Bespoke Video Platform</h1>
        </main>
        <div className="content-l">
          <p>Your go-to place for exclusive videos.</p>
          <Link to={`/videos/video/${id}`} className="button">
            Watch videos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomaPage;
