/**
 * Database connection for intent-layer-backend.
 * Uses Prisma — same client can be passed to search module.
 */

import { PrismaClient } from "@prisma/client";

let prismaInstance = null;
let hasLoggedNoUrl = false;

/**
 * Get Prisma client. Creates singleton if not exists.
 * @returns {import('@prisma/client').PrismaClient | null}
 */
export function getPrisma() {
  if (!process.env.DATABASE_URL) {
    if (!hasLoggedNoUrl) {
      hasLoggedNoUrl = true;
      console.log("[DB] DATABASE_URL not set — skipping PostgreSQL");
    }
    return null;
  }
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
    console.log("[DB] Prisma client initialized (PostgreSQL)");
  }
  return prismaInstance;
}

/**
 * Verify DB connection and log status.
 */
export async function logDbConnectionStatus() {
  const prisma = getPrisma();
  if (!prisma) return;
  try {
    await prisma.$connect();
    console.log("[DB] Connected to PostgreSQL successfully");
  } catch (err) {
    console.error("[DB] PostgreSQL connection failed:", err.message);
  }
}
