import pkg from "@prisma/client";
const { PrismaClient } = pkg;

export const db = new PrismaClient()

export async function connectToDB() {
  try {
    await db.$connect();
    console.log("[database]: connected!");
  } catch (err) {
    console.log("[database]: connection error: ", err);
    await db.$disconnect();
  }
}
