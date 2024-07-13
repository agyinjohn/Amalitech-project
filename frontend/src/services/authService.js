import axios from "axios";

const API_URL = "https://amalitech-project-6652.onrender.com/api"; // Replace with your API URL

const signup = (email, password) => {
  return axios.post(`${API_URL}/signup`, { email, password });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const resetPasswordRequest = (email) => {
  return axios.post(`${API_URL}/reset-password-request`, { email });
};

export default {
  signup,
  login,
  resetPasswordRequest,
};
