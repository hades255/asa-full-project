import pkg from "@prisma/client";
const { PrismaClient, BookingStatus, PaymentStatus } = pkg;

import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";
import { createNotification } from "./NotificationsController.js";
import { fetchClerkUserData, formatClerkUserData } from "../utils/clerkApi.js";
import {
  formatProfile,
  formatBookingServices,
} from "../utils/profileFormatter.js";

const prisma = new PrismaClient();

// Get customer preferences by customer ID
const getCustomerPreferences = async (customerId) => {
  try {
    const preferences = await prisma.userCategoryPreference.findMany({
      where: { userId: customerId },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
      },
    });

    // Format the response to match the getMyPreferences structure
    const formattedPreferences = preferences.map((pref) => ({
      id: pref.id,
      userId: pref.userId,
      categoryId: pref.categoryId,
      category: {
        id: pref.category.id,
        title: pref.category.title,
        type: pref.category.type,
        parentId: pref.category.parentId,
        parent: pref.category.parent,
      },
    }));

    return formattedPreferences;
  } catch (error) {
    console.error("Error fetching customer preferences:", error);
    return [];
  }
};

// Get all bookings for logged-in user
export const getBookings = async (req, res) => {
  try {
    console.log("Called the get booking API from vendor panel => ", req.user);

    const {
      page = 1,
      limit = 10,
      status, // Add status filter parameter
    } = req.query;

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

    // Validate status if provided using BookingStatus enum
    const validStatuses = Object.values(BookingStatus);
    if (status && !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Build where clause with status filter
    const whereClause = {
      userId: req.user.id,
      ...(status ? { status: status.toUpperCase() } : {}),
    };

    // Get total count for pagination metadata
    const totalBookings = await prisma.booking.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalBookings / limitNumber);

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            //  eco_score: true,
            clerk_user_id: true,
          },
        },
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
        bookingServices: {
          include: {
            service: {
              include: {
                media: true,
                category: true,
              },
            },
          },
        },
        reviews: true,
      },
      skip,
      take: limitNumber,
      orderBy: {
        created_at: "desc", // Most recent first
      },
    });

    // Fetch Clerk customer data, format profiles, and get customer preferences for each booking
    const bookingsWithClerkData = await Promise.all(
      bookings.map(async (booking) => {
        const rawClerkCustomerData = await fetchClerkUserData(
          booking.customer?.clerk_user_id
        );

        // Format Clerk customer data
        const clerkCustomerData = formatClerkUserData(rawClerkCustomerData);

        // Get customer preferences
        const customerPreferences = await getCustomerPreferences(
          booking.customer?.id
        );

        // Get customer reviews and calculate average rating
        const customerReviews = await prisma.review.findMany({
          where: { userId: booking.user?.id },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        });

        const totalRating = customerReviews.reduce(
          (sum, review) => sum + (review.rating || 0),
          0
        );
        const averageRating =
          customerReviews.length > 0 ? totalRating / customerReviews.length : 0;

        const formattedBooking = { ...booking };

        // Format profile data
        if (booking.profile) {
          formattedBooking.profile = formatProfile(booking.profile, {
            isInWishlist: false,
          });
        }

        // Format bookingServices data
        if (booking.bookingServices) {
          formattedBooking.bookingServices = formatBookingServices(
            booking.bookingServices
          );
        }

        // Restructure customer data
        const enhancedCustomer = {
          ...booking.customer,
          clerkCustomerData,
          customerPreferences,
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviewsCount: customerReviews.length,
          reviews: customerReviews,
        };

        return {
          ...formattedBooking,
          customer: enhancedCustomer,
        };
      })
    );

    res.status(200).json({
      data: bookingsWithClerkData,
      pagination: {
        total: totalBookings,
        page: pageNumber,
        limit: limitNumber,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark booking as confirmed or pending etc.
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        profile: {
          include: {
            services: {
              include: {
                media: true,
              },
            },
          },
        },
      },
    });

    // Update user's eco_score when status becomes COMPLETED
    // if (
    //   status === BookingStatus.COMPLETED &&
    //   booking.profile
    // ) {
    //   const eco_score = booking.profile.eco_score;

    //   const updatedUser = await prisma.user.update({
    //     where: { id: booking.customerId },
    //     data: {
    //       eco_score: {
    //         increment: eco_score,
    //       },
    //     },
    //   });

    //   console.log("User eco_score updated => ", updatedUser);
    // }

    // Create a notification when status changes
    await createNotification(
      booking.userId,
      booking.id,
      "Booking",
      `Your booking status has changed to ${booking.status}.`
    );

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark booking as confirmed or pending etc.
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            //   eco_score: true,
            clerk_user_id: true,
          },
        },
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
        bookingServices: {
          include: {
            service: {
              include: {
                media: true,
              },
            },
          },
        },
        reviews: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Format profile and bookingServices data
    const formattedBooking = { ...booking };

    if (booking.profile) {
      formattedBooking.profile = formatProfile(booking.profile, {
        isInWishlist: false,
      });
    }

    if (booking.bookingServices) {
      formattedBooking.bookingServices = formatBookingServices(
        booking.bookingServices
      );
    }

    // Get customer preferences
    const customerPreferences = await getCustomerPreferences(
      booking.customer?.id
    );

    // Fetch and format Clerk customer data
    const rawClerkCustomerData = await fetchClerkUserData(
      booking.customer?.clerk_user_id
    );
    const clerkCustomerData = formatClerkUserData(rawClerkCustomerData);

    // Get customer reviews and calculate average rating
    const customerReviews = await prisma.review.findMany({
      where: { userId: booking.user?.id },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    const totalRating = customerReviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const averageRating =
      customerReviews.length > 0
        ? Number((totalRating / customerReviews.length).toFixed(1))
        : 0;

    // Restructure customer data
    const enhancedCustomer = {
      ...booking.customer,
      clerkCustomerData,
      customerPreferences,
      averageRating: averageRating, // Round to 1 decimal place
      reviewsCount: customerReviews.length,
      reviews: customerReviews,
    };

    const bookingWithClerkData = {
      ...formattedBooking,
      customer: enhancedCustomer,
    };

    res.status(200).json(bookingWithClerkData);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Bookings for Calendar.
export const bookingsForCalendar = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        id: true,
        check_in: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        status: true,
      },
    });

    // Map to required format
    const events = bookings.map((booking) => {
      const eventStart = new Date(booking.check_in);
      const eventEnd = new Date(booking.check_in);
      eventEnd.setHours(eventEnd.getHours() + 0);

      return {
        id: booking.id,
        eventStart,
        eventEnd,
        eventName: `Booking with ${booking.user.first_name || "Space User"}`,
        eventColor: getEventColor(booking.status),
      };
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create Booking (Utility function)
export const createBooking = async (
  userId,
  check_in,
  status,
  spend,
  duration = 0,
  time = null
) => {
  const booking = await prisma.booking.create({
    data: { userId, check_in, status, spend, duration, time },
  });

  // Create a notification when status changes
  await createNotification(
    booking.userId,
    booking.id,
    "Booking",
    `New booking registered having status ${status}.`
  );

  return booking;
};

// Cancel Booking (For Vendor/Admin)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    // Validate cancellation reason
    if (!cancellationReason || cancellationReason.trim().length === 0) {
      return res.status(400).json({
        message: "Cancellation reason is required",
      });
    }

    // Find the booking and verify ownership (booking belongs to this vendor)
    const booking = await prisma.booking.findFirst({
      where: {
        id: id,
        userId: req.user.id, // Ensure the booking belongs to the current vendor
      },
      include: {
        profile: true,
        customer: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found or you don't have permission to cancel this booking",
      });
    }

    // Check if booking can be cancelled using BookingStatus enum
    if (booking.status === BookingStatus.CANCELLED) {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    if (booking.status === BookingStatus.COMPLETED) {
      return res.status(400).json({
        message: "Cannot cancel a completed booking",
      });
    }

    // Update booking status to CANCELLED and add cancellation reason
    const updatedBooking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: cancellationReason.trim(),
        notes: `Booking cancelled by vendor: ${cancellationReason.trim()}`,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
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
        bookingServices: {
          include: {
            service: {
              include: {
                media: true,
                category: true,
              },
            },
          },
        },
      },
    });

    // Create notification for customer about cancellation by vendor
    if (booking.customerId) {
      await createNotification(
        booking.customerId,
        updatedBooking.id,
        "Booking",
        `Your booking for ${
          updatedBooking.profile?.name || "the venue"
        } has been cancelled by the vendor. Reason: ${cancellationReason}`
      );
    }

    // Format the response
    const formattedBooking = { ...updatedBooking };

    if (updatedBooking.profile) {
      formattedBooking.profile = formatProfile(updatedBooking.profile, {
        isInWishlist: false,
      });
    }

    if (updatedBooking.bookingServices) {
      formattedBooking.bookingServices = formatBookingServices(
        updatedBooking.bookingServices
      );
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: formattedBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to map booking status to colors
function getEventColor(status) {
  const colors = {
    [BookingStatus.PENDING]: "yellow",
    [BookingStatus.APPROVED]: "sky",
    [BookingStatus.CANCELLED]: "red",
    [BookingStatus.COMPLETED]: "green",
  };
  return colors[status] || "gray";
}
