import OpenAI from "openai";
import { config } from "../config/env.js";

/**
 * Single OpenAI/LLM access layer for JSON responses.
 * Other services should call this function instead of using OpenAI directly.
 *
 * @param {object} params
 * @param {string} [params.model]
 * @param {Array<{role: "system"|"user"|"assistant", content: string}>} [params.messages]
 * @param {string} [params.systemPrompt]
 * @param {string} [params.userPrompt]
 * @param {number} [params.temperature]
 * @returns {Promise<object>} Parsed JSON object returned by the model
 */
export async function runOpenAiJson(params = {}) {
  const apiKey = config.intent?.openaiApiKey;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const messages =
    Array.isArray(params.messages) && params.messages.length > 0
      ? params.messages
      : [
          { role: "system", content: String(params.systemPrompt || "") },
          { role: "user", content: String(params.userPrompt || "") },
        ];

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: params.model || config.intent.openaiModel || "gpt-4o",
    messages,
    response_format: { type: "json_object" },
    temperature:
      typeof params.temperature === "number" ? params.temperature : 0.2,
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No response from LLM");
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("LLM returned invalid JSON");
  }
}
