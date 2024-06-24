import axios from "axios";

const API_URL = "http://localhost:8000/api/videos"; // Replace with your API URL

const uploadVideo = (formData) => {
  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getVideos = () => {
  return axios.get(`${API_URL}/listVideos`);
};

export default {
  uploadVideo,
  getVideos,
};
