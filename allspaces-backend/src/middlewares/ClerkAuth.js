import dotenv from "dotenv";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { verifyClerkSession } from "../utils/clerkApi.js";

dotenv.config();
const prisma = new PrismaClient();

export const authenticateUser = async (req, res, next) => {
  try {
    const sessionId = req.headers["session-id"]; // Extract session-id from headers

    console.log("request headers => ", req.headers);

    if (!sessionId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Session ID missing" });
    }

    // Verify session with Clerk API
    const session = await verifyClerkSession(sessionId);

    console.log("Clerk Session Response => ", session);

    if (!session || !session.user_id || session.status !== "active") {
      return res.status(401).json({ error: "Unauthorized: Invalid session" });
    }

    const user = await prisma.user.findFirst({
      where: {
        roles: {
          has: "USER",
        },
        clerk_user_id: session.user_id,
      },
    });

    console.log("Space User => ", user);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Invalid user" });
    }

    // Attach user info to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Session verification failed:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid session" });
  }
};
