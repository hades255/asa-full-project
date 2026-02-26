import axios from "axios";
import { envConfig } from "../config/env";
import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "all_spaces_session_id";

/**
 * Call intent-layer search-with-filters API (manual filter search).
 * @param {{ filters: { date?, duration?, noOfGuests?, location?, categoryIds? }, lastLocation? }} params
 * @returns {Promise<{ recommendations, summary, intent, noMatchMessage, candidatesCount }>}
 */
export async function searchWithFilters({ filters = {}, lastLocation }) {
  const baseUrl = (envConfig.EXPO_PUBLIC_INTENT_API_BASE_URL || "").replace(/\/?$/, "");
  const url = `${baseUrl}/intent/search-with-filters`;

  let sessionId = "";
  try {
    sessionId = (await SecureStore.getItemAsync(SESSION_KEY)) || "";
  } catch (_) {}

  const res = await axios.post(
    url,
    {
      filters: {
        date: filters.date,
        duration: filters.duration,
        noOfGuests: filters.noOfGuests,
        location: filters.location,
        categoryIds: filters.categoryIds,
      },
      lastLocation: lastLocation || null,
      ...(sessionId ? { sessionId } : {}),
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );

  return res.data;
}
