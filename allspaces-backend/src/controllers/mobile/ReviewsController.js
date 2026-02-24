import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { hashPassword } from "../../utils/hash.js";
import { createNotification } from "../NotificationsController.js";
import { updateProfileRating } from "../ReviewsController.js";

const prisma = new PrismaClient();

// Add a Profile to Wishlist
export const generateReviewsAndRatings = async (req, res) => {
  try {
    const { profileId, bookingId, rating, comment } = req.body;

    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });
    if (!profile) {
      return res.status(401).json({ error: "Invalid profile" });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
      },
    });
    if (!booking) {
      return res.status(401).json({ error: "Invalid Booking" });
    }

    const review = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
        profileId,
        bookingId,
      },
    });

    if (review) {
      return res
        .status(401)
        .json({ error: "Review has already been added on this Profile" });
    }

    const validRating =
      Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 1;

    const review_generated = await prisma.review.create({
      data: {
        userId: req.user.id,
        profileId,
        bookingId,
        rating: validRating,
        comment,
      },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { isReviewed: true },
    });

    console.log("Reviews data after generating => ", review_generated);

    // Update the profile's average rating using the updateProfileRating function
    await updateProfileRating(profileId);

    console.log("Profile rating updated successfully");

    const profile_data = await prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    console.log(
      "Profile data after updating the ratings counts => ",
      profile_data
    );

    res.status(201).json(review_generated);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};
