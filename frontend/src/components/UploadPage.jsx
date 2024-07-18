import React, { useState } from "react";
import videoService from "../services/videoService";
import "./UploadPage.css";

function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      await videoService.uploadVideo(formData, token);
      alert("Video uploaded successfully");
    } catch (error) {
      setError("Error uploading video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      <form className="upload-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Video File</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="video/*"
            disabled={loading}
          />
        </div>
        <button type="button" onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default UploadPage;
