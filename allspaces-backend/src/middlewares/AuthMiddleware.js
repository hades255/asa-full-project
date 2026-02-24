import dotenv from "dotenv";
import { verifyToken } from "../utils/jwt.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

dotenv.config();
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "You are not authorized" });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log("This is a decoded user => ", decoded);

    const user_record = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { parent: true },
    });

    if (user_record.parent_id) {
      console.log("This is a staff member user");
      req.user = user_record.parent;
      req.staff_user = user_record;
      console.log("parent user => ", req.user);
      console.log("Real user => ", req.staff_user);
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
