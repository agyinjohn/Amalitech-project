import React, { useRef, useEffect } from "react";

const VideoWidget = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleError = () => {
      console.error("Video error occurred, refreshing stream...");
      videoElement.load(); // Reload the video stream
      videoElement.play(); // Attempt to play the video again
    };

    videoElement.addEventListener("error", handleError);

    return () => {
      videoElement.removeEventListener("error", handleError);
    };
  }, [src]);

  useEffect(() => {
    const videoElement = videoRef.current;
    videoElement.load(); // Reload the video when src changes
    videoElement.play(); // Automatically play the video after loading
  }, [src]);

  return (
    <div className="video-container-v">
      <video
        crossorigin="anonymous"
        ref={videoRef}
        controls
        className="video-element"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoWidget;
