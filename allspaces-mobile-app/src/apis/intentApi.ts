import axios from "axios";
import { envConfig } from "@/utils/envConfig";
import { SecureStoreService } from "@/config/secureStore";
import { T_INTENT_SEARCH_RESULT } from "@/redux/types";

const getIntentBaseUrl = () =>
  (envConfig.EXPO_PUBLIC_INTENT_API_BASE_URL || "").replace(/\/?$/, "");

export const searchByPrompt = async (params: {
  prompt: string;
  context?: {
    timezone?: string;
    lastLocation?: { lat: number; lng: number; address?: string };
  };
}): Promise<T_INTENT_SEARCH_RESULT> => {
  const baseUrl = getIntentBaseUrl();
  if (!baseUrl)
    throw new Error("EXPO_PUBLIC_INTENT_API_BASE_URL is not configured");
  const url = `${baseUrl}/intent/search-by-prompt`;

  let sessionId = "";
  try {
    sessionId = (await SecureStoreService.getValue("SESSION_ID")) || "";
  } catch {
    // ignore
  }

  if (__DEV__) {
    console.log("[IntentAPI] POST", url);
  }

  const doRequest = () =>
    axios.post(
      url,
      {
        prompt: String(params.prompt || "").trim(),
        context: {
          timezone: params.context?.timezone || "Europe/London",
          lastLocation: params.context?.lastLocation ?? null,
        },
        ...(sessionId ? { sessionId } : {}),
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

  try {
    const res = await doRequest();
    return res.data as T_INTENT_SEARCH_RESULT;
  } catch (firstErr: any) {
    const isRetriable =
      firstErr?.code === "ECONNABORTED" ||
      firstErr?.code === "ERR_NETWORK" ||
      firstErr?.message?.toLowerCase?.().includes("network");
    if (isRetriable) {
      if (__DEV__) console.log("[IntentAPI] Retrying after 2s…");
      await new Promise((r) => setTimeout(r, 2000));
      const res = await doRequest();
      return res.data as T_INTENT_SEARCH_RESULT;
    }
    throw firstErr;
  }
};
