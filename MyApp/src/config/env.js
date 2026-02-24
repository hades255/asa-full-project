// Configure API base URL - use your AllSpaces backend URL
// e.g. https://your-api.allspaces.ai/api or http://localhost:8080/api
export const envConfig = {
  EXPO_PUBLIC_API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY || "",
  // Intent Layer (MVP 1.5) - parse natural-language prompts
  EXPO_PUBLIC_INTENT_API_BASE_URL:
    process.env.EXPO_PUBLIC_INTENT_API_BASE_URL || "http://198.18.1.206:3001/api",
};
