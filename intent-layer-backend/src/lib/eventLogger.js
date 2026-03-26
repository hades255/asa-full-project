import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { config } from "../config/env.js";

function nowIso() {
  return new Date().toISOString();
}

function safeMeta(meta) {
  if (!meta || typeof meta !== "object") return undefined;
  return meta;
}

const EVENT_LOG_FILE = path.resolve(process.cwd(), config.logging.eventLogFile);
let logFileReady = false;

async function ensureLogFileDirectory() {
  if (logFileReady) return;
  await mkdir(path.dirname(EVENT_LOG_FILE), { recursive: true });
  logFileReady = true;
}

async function writeLogLine(level, payload) {
  try {
    await ensureLogFileDirectory();
    const line = JSON.stringify({ level, ...payload }) + "\n";
    await appendFile(EVENT_LOG_FILE, line, "utf8");
  } catch (err) {
    console.error(
      "[EVENT]",
      "Failed to write event log file:",
      err?.message || err
    );
  }
}

export function logEvent(event, meta) {
  const payload = { ts: nowIso(), event, ...(safeMeta(meta) || {}) };
  console.log("[EVENT]", JSON.stringify(payload));
  void writeLogLine("info", payload);
}

export function logWarn(event, meta) {
  const payload = { ts: nowIso(), event, ...(safeMeta(meta) || {}) };
  console.warn("[EVENT]", JSON.stringify(payload));
  void writeLogLine("warn", payload);
}

export function logError(event, err, meta) {
  const payload = {
    ts: nowIso(),
    event,
    ...(safeMeta(meta) || {}),
    error: err?.message || String(err),
  };
  console.error("[EVENT]", JSON.stringify(payload));
  void writeLogLine("error", payload);
}
