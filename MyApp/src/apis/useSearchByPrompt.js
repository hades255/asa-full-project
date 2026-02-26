import axios from "axios";
import { envConfig } from "../config/env";
import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "all_spaces_session_id";

/**
 * Call intent-layer search-by-prompt API.
 * @param {{ prompt: string, context?: { timezone?, lastLocation? } }} params
 * @returns {Promise<{ recommendations, summary, intent, noMatchMessage, candidatesCount, repair }>}
 */
export async function searchByPrompt({ prompt, context = {} }) {
  const baseUrl = (envConfig.EXPO_PUBLIC_INTENT_API_BASE_URL || "").replace(/\/?$/, "");
  const url = `${baseUrl}/intent/search-by-prompt`;

  let sessionId = "";
  try {
    sessionId = (await SecureStore.getItemAsync(SESSION_KEY)) || "";
  } catch (_) {}

  const res = await axios.post(
    url,
    {
      prompt: String(prompt || "").trim(),
      context: {
        timezone: context.timezone || "Europe/London",
        lastLocation: context.lastLocation || null,
      },
      ...(sessionId ? { sessionId } : {}),
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );

  return res.data;
}
