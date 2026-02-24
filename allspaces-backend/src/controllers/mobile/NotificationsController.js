import pkg from "@prisma/client";
const { PrismaClient } = pkg;

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

// Search Notifications
export const searchNotifications = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required for search" });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
        OR: [
          { message: { contains: keyword, mode: "insensitive" } },
          { resourceType: { contains: keyword, mode: "insensitive" } },
        ],
      }
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error searching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};
