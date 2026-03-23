const validateEnvVar = (key: string, value: string | undefined, required: boolean = false): string | undefined => {
  if (required && !value) {
    if (__DEV__) {
      console.error(`Missing required environment variable: ${key}`);
    } else {
      console.error(`Configuration error: ${key} is missing`);
    }
  }
  return value;
};

export const envConfig = {
  EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    validateEnvVar("EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY", process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
    validateEnvVar("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY", process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY, true),
  EXPO_PUBLIC_WEB_CLIENT_ID: validateEnvVar("EXPO_PUBLIC_WEB_CLIENT_ID", process.env.EXPO_PUBLIC_WEB_CLIENT_ID),
  EXPO_PUBLIC_WEB_CLIENT_SECRET: validateEnvVar("EXPO_PUBLIC_WEB_CLIENT_SECRET", process.env.EXPO_PUBLIC_WEB_CLIENT_SECRET),
  EXPO_PUBLIC_API_BASE_URL: validateEnvVar("EXPO_PUBLIC_API_BASE_URL", process.env.EXPO_PUBLIC_API_BASE_URL),
  EXPO_PUBLIC_API_KEY: validateEnvVar("EXPO_PUBLIC_API_KEY", process.env.EXPO_PUBLIC_API_KEY),
  EXPO_PUBLIC_STORAGE_BASE_URL: validateEnvVar("EXPO_PUBLIC_STORAGE_BASE_URL", process.env.EXPO_PUBLIC_STORAGE_BASE_URL),
  EXPO_PUBLIC_GOOGLE_KEY: validateEnvVar("EXPO_PUBLIC_GOOGLE_KEY", process.env.EXPO_PUBLIC_GOOGLE_KEY),
  EXPO_PUBLIC_GOOGLE_API_URL: validateEnvVar("EXPO_PUBLIC_GOOGLE_API_URL", process.env.EXPO_PUBLIC_GOOGLE_API_URL),
  EXPO_PUBLIC_GOOGLE_GEO_API: validateEnvVar("EXPO_PUBLIC_GOOGLE_GEO_API", process.env.EXPO_PUBLIC_GOOGLE_GEO_API),
  EXPO_PUBLIC_INTENT_API_BASE_URL: validateEnvVar(
    "EXPO_PUBLIC_INTENT_API_BASE_URL",
    process.env.EXPO_PUBLIC_INTENT_API_BASE_URL
  ),
};

// Validate critical environment variables at module load
if (!envConfig.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  const errorMessage = "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required but not set. Please check your .env file.";
  if (__DEV__) {
    console.error(errorMessage);
  } else {
    // In production, we still want to log but not crash the app immediately
    console.error("Critical configuration error: Clerk publishable key is missing");
  }
}
