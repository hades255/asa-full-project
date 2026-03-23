import { TokenCache } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const MAX_RETRIES = 2;
const RETRY_DELAY = 100; // milliseconds

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      let lastError: Error | null = null;
      
      // Retry logic for getToken
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const item = await SecureStore.getItemAsync(key);
          if (item) {
            if (__DEV__) {
              console.log(`Token retrieved successfully for key: ${key}`);
            }
            return item;
          } else {
            if (__DEV__) {
              console.log(`No token found for key: ${key}`);
            }
            return null;
          }
        } catch (error: any) {
          lastError = error;
          const errorMessage = error?.message || String(error);
          
          if (__DEV__) {
            console.error(`SecureStore getItem error (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, errorMessage);
          } else {
            console.error(`Token cache get error for key ${key}:`, errorMessage);
          }

          // If it's a critical error or last attempt, try to clean up
          if (attempt === MAX_RETRIES) {
            try {
              await SecureStore.deleteItemAsync(key);
              if (__DEV__) {
                console.log(`Cleaned up corrupted token for key: ${key}`);
              }
            } catch (deleteError) {
              if (__DEV__) {
                console.error(`Failed to clean up token for key ${key}:`, deleteError);
              }
            }
            return null;
          }

          // Wait before retrying
          await delay(RETRY_DELAY * (attempt + 1));
        }
      }

      return null;
    },
    saveToken: async (key: string, token: string) => {
      let lastError: Error | null = null;

      // Retry logic for saveToken
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          await SecureStore.setItemAsync(key, token);
          if (__DEV__) {
            console.log(`Token saved successfully for key: ${key}`);
          }
          return;
        } catch (error: any) {
          lastError = error;
          const errorMessage = error?.message || String(error);
          
          if (__DEV__) {
            console.error(`SecureStore setItem error (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, errorMessage);
          } else {
            console.error(`Token cache save error for key ${key}:`, errorMessage);
          }

          // If it's the last attempt, throw the error
          if (attempt === MAX_RETRIES) {
            throw new Error(`Failed to save token after ${MAX_RETRIES + 1} attempts: ${errorMessage}`);
          }

          // Wait before retrying
          await delay(RETRY_DELAY * (attempt + 1));
        }
      }
    },
  };
};

// SecureStore is not supported on the web
export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
