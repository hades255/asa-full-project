/**
 * Database connection for intent-layer-backend.
 * Uses Prisma — same client can be passed to search module.
 */

import { PrismaClient } from "@prisma/client";

let prismaInstance = null;

/**
 * Get Prisma client. Creates singleton if not exists.
 * @returns {import('@prisma/client').PrismaClient | null}
 */
export function getPrisma() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}
