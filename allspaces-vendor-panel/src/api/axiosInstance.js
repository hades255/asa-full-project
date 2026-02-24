import axios from "axios";
import { getAccessToken, removeAccessToken, removeRefreshToken } from "../utils/secureLs";
import { BACKEND_BASE_URL } from "../utils/Constants";
import { Navigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error("Unauthorized! Redirecting to login...");
      removeAccessToken();
      removeRefreshToken();
      // Navigate('/signin');
      window.location.href = "/signin";
    } else if (error.response && error.response.status === 403) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error("Token has been expired! Redirecting to login...");
      removeAccessToken();
      removeRefreshToken();
      // Navigate('/signin');
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
