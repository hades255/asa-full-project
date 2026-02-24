import axios from "axios";
import { VITE_API_BASE_URL } from "../utils/envConfig";
import {
  getFromSecureLS,
  removeFromSecureLS,
  SECURE_LS_TOKENS,
} from "../utils/secureLs";
import { showLogMessage, showToast } from "../utils/logs";

export const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  timeout: 30000,
  timeoutErrorMessage: `Request is timed out.`,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// API CLIENT REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config) => {
    const token = getFromSecureLS(SECURE_LS_TOKENS.ACCESS_TOKEN);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API CLIENT RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error =>", JSON.stringify(error));

    if (error.response && error.response.status === 401) {
      showLogMessage("Unauthorized! Redirecting to login...");
      removeFromSecureLS(SECURE_LS_TOKENS.ACCESS_TOKEN);
      removeFromSecureLS(SECURE_LS_TOKENS.REFRESH_TOKEN);
      window.location.href = "/signin";
    } else if (error.response && error.response.status === 403) {
      showLogMessage("Your session has been expired! Redirecting to login...");
      removeFromSecureLS(SECURE_LS_TOKENS.ACCESS_TOKEN);
      removeFromSecureLS(SECURE_LS_TOKENS.REFRESH_TOKEN);
      window.location.href = "/signin";
    }
    showToast(error.response.data.message ?? "Something went wrong!", `error`);
    return Promise.reject(error);
  }
);
