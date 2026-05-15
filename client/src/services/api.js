import axios from "axios";

const API = axios.create({
  // baseURL: "https://weather-backend-xez1.onrender.com/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // important for CORS + auth
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// optional: error logging (helpful for debug)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
