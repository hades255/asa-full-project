import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

// Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark notification(s) as read
export const markAsRead = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    // const idsArray = ids.split(",");
    const notifications = await prisma.notification.updateMany({
      where: { id: Array.isArray(ids) ? { in: ids } : ids },
      data: { isRead: true },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error updating notification(s):", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create Notification (Utility function)
export const createNotification = async (userId, resourceId, resourceType, message) => {
  return await prisma.notification.create({
    data: { userId, resourceId, resourceType, message },
  });
};
