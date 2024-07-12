import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Replace with your API URL

const signup = (email, password) => {
  return axios.post(`${API_URL}/signup`, { email, password });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const resetPassword = (email) => {
  return axios.post(`${API_URL}/reset-password-request`, { email });
};

export default {
  signup,
  login,
  resetPassword,
};
