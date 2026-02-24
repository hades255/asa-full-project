import axios from "axios";
import { envConfig } from "../config/env";
import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "all_spaces_session_id";

export const apiClient = axios.create({
  baseURL: envConfig.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    key: envConfig.EXPO_PUBLIC_API_KEY || "",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const sessionId = await SecureStore.getItemAsync(SESSION_KEY);
      if (sessionId) {
        config.headers["session-id"] = sessionId;
      }
    } catch (e) {
      // Ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const API_ROUTES = {
  SEARCH_PROFILES: "/mobile/profiles/search",
  PROFILE_FILTERS: "/mobile/profiles/filters",
};
