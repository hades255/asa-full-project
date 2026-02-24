import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { hashPassword } from "../../utils/hash.js";
import { createNotification } from "../NotificationsController.js";
import { formatProfile } from "../../utils/profileFormatter.js";

const prisma = new PrismaClient();

// Get all wishlisted profiles for the logged-in user
export const getWishlists = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res.status(400).json({
        message:
          "Invalid pagination parameters. Page and limit must be positive integers.",
      });
    }

    // Get total count for pagination metadata
    const totalWishlists = await prisma.wishlist.count({
      where: { userId: req.user.id },
    });

    const totalPages = Math.ceil(totalWishlists / limitNumber);

    // Get paginated wishlists
    const wishlists = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        profile: {
          include: {
            facilities: true,
            services: {
              include: {
                media: true,
                category: {
                  include: {
                    parent: true,
                  },
                },
              },
            },
            medias: true,
            reviews: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: "desc", // Most recent first
      },
    });

    // Format each profile in the wishlist using utility function
    const formattedWishlists = wishlists.map((wishlist) => {
      const formattedProfile = formatProfile(wishlist.profile, {
        isInWishlist: true,
      });

      return {
        id: wishlist.id,
        userId: wishlist.userId,
        profileId: wishlist.profileId,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
        profile: formattedProfile,
      };
    });

    res.status(200).json({
      data: formattedWishlists,
      pagination: {
        total: totalWishlists,
        page: pageNumber,
        limit: limitNumber,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a Profile to Wishlist
export const createWishlist = async (req, res) => {
  try {
    const { profileId } = req.body;

    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });
    if (!profile) {
      return res.status(401).json({ error: "Invalid profile" });
    }

    const wishlist_rec = await prisma.wishlist.findFirst({
      where: {
        userId: req.user.id,
        profileId,
      },
    });

    if (wishlist_rec) {
      return res
        .status(401)
        .json({ error: "This profile already in wishlist" });
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: req.user.id,
        profileId,
      },
    });

    // Create a notification when status changes
    await createNotification(
      req.user.id,
      wishlist.id,
      "Wishlist",
      `A profile ${profile.name} has been added in your wishlist.`
    );

    res.status(201).json(wishlist);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a Profile from Wishlist
export const deleteWishlist = async (req, res) => {
  try {
    const { profileId } = req.params;

    await prisma.wishlist.deleteMany({
      where: { userId: req.user.id, profileId },
    });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};
