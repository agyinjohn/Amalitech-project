import axios from "axios";

const API_URL = "https://amalitech-project-6652.onrender.com/api/videos"; // Replace with your API URL

const uploadVideo = async (formData, token) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

const getVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/listVideos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

export default {
  uploadVideo,
  getVideos,
};
