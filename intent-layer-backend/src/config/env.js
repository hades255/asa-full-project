import "dotenv/config";

/** Candidate source: "mock" | "db" | "http" | "auto" (db → http → mock fallback) */
const CANDIDATE_SOURCE_RAW = (
  process.env.CANDIDATE_SOURCE || "auto"
).toLowerCase();
const CANDIDATE_SOURCE = ["mock", "db", "http", "auto"].includes(
  CANDIDATE_SOURCE_RAW
)
  ? CANDIDATE_SOURCE_RAW
  : "auto";

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  logging: {
    eventLogFile:
      process.env.EVENT_LOG_FILE || "intent-layer-backend/logs/events.log",
  },
  candidateSource: CANDIDATE_SOURCE,
  search: {
    candidateFetchLimit: parseInt(
      process.env.SEARCH_CANDIDATE_FETCH_LIMIT || "60",
      10
    ),
    rankResultLimit: parseInt(process.env.SEARCH_RANK_RESULT_LIMIT || "12", 10),
  },
  allspaces: {
    apiBaseUrl: process.env.ALLSPACES_API_BASE_URL || "",
    apiKey: process.env.ALLSPACES_API_KEY || "",
  },
  intent: {
    llmProvider: process.env.INTENT_LLM_PROVIDER || "openai",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    openaiModel: process.env.OPENAI_MODEL || "gpt-4o",
    extractionEnabled: process.env.INTENT_EXTRACTION_ENABLED === "true",
    defaultTimezone: process.env.DEFAULT_TIMEZONE || "Europe/London",
  },
};
