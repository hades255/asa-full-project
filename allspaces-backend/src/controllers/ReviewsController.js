import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { createNotification } from "./NotificationsController.js";

const prisma = new PrismaClient();

/**
 * Updates the average rating and review count statistics for a profile
 * @param {string} profileId - ID of the profile to update
 */
export const updateProfileRating = async (profileId) => {
  try {
    // Get all reviews for the profile
    const reviews = await prisma.review.findMany({
      where: {
        profileId,
      },
      select: {
        rating: true,
      },
    });

    // Count reviews by star rating
    const starCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    // Calculate total and count
    let totalRating = 0;
    let validReviewCount = 0;

    reviews.forEach((review) => {
      if (review.rating > 0) {
        totalRating += review.rating;
        validReviewCount++;

        // Increment the appropriate star count
        if (review.rating >= 1 && review.rating <= 5) {
          starCounts[review.rating]++;
        }
      }
    });

    // Calculate average rating
    const averageRating =
      validReviewCount > 0
        ? Number((totalRating / validReviewCount).toFixed(1))
        : 0;

    // Update the profile with the new rating data
    await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        averageRating,
        totalReviews: reviews.length,
        oneStarCount: starCounts[1],
        twoStarCount: starCounts[2],
        threeStarCount: starCounts[3],
        fourStarCount: starCounts[4],
        fiveStarCount: starCounts[5],
      },
    });

    console.log(
      `Updated rating for profile ${profileId}: ${averageRating} (${validReviewCount} reviews)`
    );
    return { averageRating, totalReviews: reviews.length, starCounts };
  } catch (error) {
    console.error(`Error updating profile rating for ${profileId}:`, error);
    throw error;
  }
};

// Function to create a review with rating update
export const createReview = async (req, res) => {
  try {
    const { userId, profileId, bookingId, rating, comment } = req.body;

    // Validation
    if (!userId || !profileId || !bookingId) {
      return res.status(400).json({
        message: "User ID, Profile ID, and Booking ID are required",
      });
    }

    // Check if review already exists for this combination
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        profileId,
        bookingId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        message: "A review already exists for this user, profile, and booking",
      });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId,
        profileId,
        bookingId,
        rating: rating ? parseInt(rating) : 0,
        comment: comment || "",
      },
    });

    // Update the booking to mark it as reviewed
    await prisma.booking.update({
      where: { id: bookingId },
      data: { isReviewed: true },
    });

    // Update the profile's average rating
    await updateProfileRating(profileId);

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to update a review with rating update
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Find the review
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ? parseInt(rating) : existingReview.rating,
        comment: comment !== undefined ? comment : existingReview.comment,
      },
    });

    // Update the profile's average rating
    await updateProfileRating(existingReview.profileId);

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to delete a review with rating update
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review to get the profileId before deletion
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const profileId = review.profileId;

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    // Update the booking to mark it as not reviewed
    await prisma.booking.update({
      where: { id: review.bookingId },
      data: { isReviewed: false },
    });

    // Update the profile's average rating
    await updateProfileRating(profileId);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all reviews for a profile
export const getReviewsByProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        profileId,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Vendor gives review/rating to customer (mobile user)
export const createCustomerReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const vendorId = req.user.id;

    // Validate required fields
    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Find the booking and verify it belongs to the vendor
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: vendorId, // Ensure the booking belongs to the current vendor
      },
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            clerk_user_id: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found or you don't have permission to review this booking",
      });
    }

    // Check if customer exists in the booking
    if (!booking.customerId) {
      return res.status(400).json({
        message: "No customer associated with this booking",
      });
    }

    // Check if vendor has already reviewed this customer for this booking
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: vendorId,
        profileId: null, // Customer reviews have null profileId
        bookingId: bookingId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this customer for this booking",
      });
    }

    // Validate rating (similar to mobile review)
    const validRating =
      Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 1;

    // Create the review in Review table (same as mobile user reviews vendor)
    const review_generated = await prisma.review.create({
      data: {
        userId: vendorId,
        profileId: null, // No profile for customer reviews
        bookingId: bookingId,
        rating: validRating,
        comment: comment || "",
      },
    });

    console.log("Customer review data after generating => ", review_generated);

    // Send notification to customer (same as vendor receives notification from mobile user)
    await createNotification(
      booking.customerId,
      booking.id,
      "Review",
      `You received a ${validRating}-star review from ${
        booking.profile?.name || "the vendor"
      }${comment ? `: "${comment}"` : ""}`
    );

    console.log("Notification sent to customer successfully");

    res.status(201).json({
      message: "Customer review created successfully",
      review: {
        id: review_generated.id,
        bookingId: booking.id,
        customerId: booking.customerId,
        customerName: `${booking.customer?.first_name || ""} ${
          booking.customer?.last_name || ""
        }`.trim(),
        rating: validRating,
        comment: comment || "",
        createdAt: review_generated.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating customer review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get vendor's reviews of customers
export const getCustomerReviewsByVendor = async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Get all reviews where vendor reviewed customers (profileId is null)
    const reviews = await prisma.review.findMany({
      where: {
        userId: vendorId,
        profileId: null, // Customer reviews have null profileId
      },
      include: {
        booking: {
          include: {
            customer: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                clerk_user_id: true,
              },
            },
            profile: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response
    const customerReviews = reviews.map((review) => ({
      id: review.id,
      bookingId: review.bookingId,
      customerId: review.booking.customerId,
      customerName: `${review.booking.customer?.first_name || ""} ${
        review.booking.customer?.last_name || ""
      }`.trim(),
      customerEmail: review.booking.customer?.email,
      profileName: review.booking.profile?.name,
      rating: review.rating,
      comment: review.comment,
      reviewedAt: review.createdAt,
      checkIn: review.booking.check_in,
    }));

    res.status(200).json({
      total: customerReviews.length,
      reviews: customerReviews,
    });
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
