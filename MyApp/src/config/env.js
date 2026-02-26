// Configure API base URL - use host IP (not localhost) for physical device / emulator
// Intent Layer: POST /api/intent/parse, POST /api/intent/search-by-prompt
export const envConfig = {
  EXPO_PUBLIC_API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://198.18.1.206:8080/api",
  EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY || "",
  EXPO_PUBLIC_INTENT_API_BASE_URL:
    process.env.EXPO_PUBLIC_INTENT_API_BASE_URL ||
    "http://144.172.91.222:20001/api",
};
