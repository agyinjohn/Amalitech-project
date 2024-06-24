import React, { useState } from "react";
import videoService from "../services/videoService";
// Import the CSS file for the UploadPage styles

function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);

    try {
      await videoService.uploadVideo(formData);
      //   alert("Video uploaded successfully");
    } catch (error) {
      //   alert("Error uploading video");
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
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Video File</label>
          <input type="file" onChange={handleFileChange} accept="video/*" />
        </div>
        <button type="button" onClick={handleUpload}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadPage;
