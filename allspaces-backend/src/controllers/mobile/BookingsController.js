import pkg from "@prisma/client";
const { PrismaClient, BookingStatus, PaymentStatus } = pkg;
import { hashPassword } from "../../utils/hash.js";
import { createNotification } from "../NotificationsController.js";
import {
  formatProfile,
  formatBookingServices,
} from "../../utils/profileFormatter.js";
import {
  getHotelsAgainstId,
  getHotelsRates,
  mapAccorHotelsDataSimple,
} from "../../utils/AccorApis.js";
import {
  fetchClerkUserData,
  formatClerkUserData,
} from "../../utils/clerkApi.js";
import axios from "axios";
import Stripe from "stripe";

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
    console.log("user ID => ", req.user.id);

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
      customerId: req.user.id,
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
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
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
      skip,
      take: limitNumber,
      orderBy: {
        created_at: "desc", // Most recent first
      },
    });

    // Format profiles and bookingServices using utility functions
    const formattedBookings = bookings.map((booking) => {
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

      // Add cancellation reason for cancelled bookings
      if (
        booking.status === BookingStatus.CANCELLED &&
        booking.cancellationReason
      ) {
        formattedBooking.cancellationReason = booking.cancellationReason;
      }

      return formattedBooking;
    });

    res.status(200).json({
      data: formattedBookings,
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

// Get a Booking against an ID
export const getBookingById = async (req, res) => {
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

    // Format profile and bookingServices using utility functions
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

    // Add cancellation reason for cancelled bookings
    if (
      booking.status === BookingStatus.CANCELLED &&
      booking.cancellationReason
    ) {
      formattedBooking.cancellationReason = booking.cancellationReason;
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
      customerReviews.length > 0 ? totalRating / customerReviews.length : 0;

    // Restructure customer data
    const enhancedCustomer = {
      ...booking.customer,
      clerkCustomerData,
      customerPreferences,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
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

// Create Booking API
export const createBooking = async (req, res) => {
  try {
    const {
      profile_id,
      check_in,
      no_of_guests,
      source,
      serviceIds,
      location,
      address,
      duration,
      time,
    } = req.body;

    if (!["SPACE", "ACCOR"].includes(source))
      return res.status(400).json({ message: "Invalid source of profile" });

    let profile = null;

    if (source === "SPACE") {
      console.log("This is a space profile flow");
      profile = await prisma.profile.findFirst({
        where: {
          id: profile_id,
        },
        include: {
          user: true,
          services: {
            include: {
              media: true,
            },
          },
        },
      });
    } else {
      console.log("This is a Accor profile flow...");
      const accorHotels = await getHotelsAgainstId(profile_id);
      const hotelCodes = accorHotels.results.map((item) => item.hotel.id);
      console.log("Hotel Codes are => ", hotelCodes);

      if (hotelCodes.length <= 0)
        return res
          .status(400)
          .json({ message: "Sorry, no profile found against ID" });

      const accorHotelsRates = await getHotelsRates(hotelCodes);
      const mapAccorToLocalProfiles = await mapAccorHotelsDataSimple(
        accorHotels,
        accorHotelsRates
      );
      const profile_accor = mapAccorToLocalProfiles?.[0];
      console.log("mapAccorToLocalProfiles => ", profile_accor);

      if (!profile_accor)
        return res
          .status(400)
          .json({ message: "Sorry, no profile found against ID" });

      const { id, name, description, email, price, location, coverMedia } =
        profile_accor;

      let vendor = await prisma.user.findFirst({
        where: {
          email: email,
        },
        include: {
          profiles: true,
        },
      });

      if (!vendor) {
        console.log("Vendor not exists, Now creating vendor...");
        const hash_password = await hashPassword("12345678");

        vendor = await prisma.user.create({
          data: {
            email,
            password: hash_password,
            refresh_token: "",
            confirmed_at: new Date(),
          },
          include: {
            profiles: true,
          },
        });

        console.log("vendor has created => ", vendor);
      }

      profile = await prisma.profile.findFirst({
        where: {
          accor_id: profile_accor.id,
          userId: vendor.id,
          source: "ACCOR",
        },
      });

      console.log("Vendor profiles => ", vendor.profiles);
      console.log(
        "vendor.profiles.find(prof => prof.accor_id === profile_id) => ",
        vendor.profiles.find((prof) => prof.id === profile_id)
      );

      if (
        vendor.profiles.length > 0 &&
        !vendor.profiles.find((prof) => prof.accor_id === profile_id)
      ) {
        return res
          .status(400)
          .json({ message: "Sorry, can't place booking on this profile" });
      }

      if (!profile) {
        console.log("Profile not exists, now creating...");
        profile = await prisma.profile.create({
          data: {
            accor_id: id,
            source: "ACCOR",
            name,
            description,
            email,
            status: "PUBLISHED",
            price,
            location,
            coverMedia,
            userId: vendor.id, // Associate with the vendor
          },
        });
        console.log("Profile has created => ", profile);
      }
    }

    console.log("Final profile data => ", profile);
    if (!profile) {
      return res
        .status(400)
        .json({ message: "Sorry, no profile found against ID" });
    }

    // Calculate spend based on selected services if serviceIds are provided
    let selectedServices = [];
    let spend = 0;

    // Ensure profile.services exists
    if (!profile.services) {
      console.log("Profile has no services");
      profile.services = [];
    }

    if (serviceIds && serviceIds.length > 0 && source === "SPACE") {
      console.log("Profile services:", profile.services);
      console.log("Service IDs provided:", serviceIds);

      // Find the vendor services that match the provided serviceIds
      selectedServices = profile.services.filter((vs) => {
        console.log("Checking service:", vs);
        return vs && vs.id && serviceIds.includes(vs.id);
      });

      console.log("Selected services after filtering:", selectedServices);

      if (selectedServices.length === 0) {
        return res
          .status(400)
          .json({ message: "No valid services selected for this profile" });
      }

      // Calculate total spend from selected services
      spend = selectedServices.reduce((sum, vs) => sum + (vs.minSpend || 0), 0);
    } else {
      // Default calculation if no serviceIds provided
      spend =
        profile.source === "ACCOR"
          ? profile.price
          : profile.services.reduce((sum, vs) => sum + (vs.minSpend || 0), 0);
    }

    console.log("Total price for booking => ", spend);

    // Parse location object to extract lat and lng
    let bookingLat = null;
    let bookingLng = null;

    if (location) {
      // Handle location parsing - it might come as a string or object
      let parsedLocation = location;
      if (typeof location === "string") {
        try {
          parsedLocation = JSON.parse(location);
        } catch (error) {
          console.warn("Error parsing location string:", error);
        }
      }

      if (parsedLocation && typeof parsedLocation === "object") {
        bookingLat = parsedLocation.lat ? parseFloat(parsedLocation.lat) : null;
        bookingLng = parsedLocation.lng ? parseFloat(parsedLocation.lng) : null;
      }
    }

    // Use the separate address field
    const bookingAddress = address || null;

    // Prepare booking service data outside transaction
    let bookingServiceData = [];
    if (serviceIds && serviceIds.length > 0 && selectedServices.length > 0) {
      console.log("Selected services:", selectedServices);

      // Filter out any invalid services
      const validSelectedServices = selectedServices.filter(
        (vs) => vs && vs.id
      );

      if (validSelectedServices.length === 0) {
        console.log("No valid services found after filtering");
        return res.status(400).json({
          message: "No valid services found for booking",
        });
      }

      // Prepare booking service data
      bookingServiceData = validSelectedServices.map((vs) => ({
        serviceId: vs.id,
        price: vs.minSpend || 0,
      }));
    }

    // Create the booking first with PENDING status
    let booking;
    try {
      booking = await prisma.booking.create({
        data: {
          profileId: profile.id,
          userId: profile.user.id,
          check_in,
          spend,
          no_of_guests,
          customerId: req.user.id,
          lat: bookingLat,
          lng: bookingLng,
          address: bookingAddress,
          duration: duration || 0,
          time: time || null,
          status: BookingStatus.PENDING, // Set initial status as PENDING
        },
      });
      console.log("Booking created with PENDING status => ", booking);
    } catch (bookingError) {
      console.error("Error creating booking:", bookingError);
      return res.status(500).json({ message: "Failed to create booking" });
    }

    const amount = spend * (no_of_guests + 1);

    // Update booking with payment information
    try {
      booking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          amount: +amount,
          payment_status: PaymentStatus.PENDING,
        },
      });
      console.log("Booking updated with payment information => ", booking);
    } catch (updateError) {
      console.error("Error updating booking with payment info:", updateError);
      // Clean up booking if update fails
      try {
        await prisma.booking.delete({ where: { id: booking.id } });
      } catch (cleanupError) {
        console.error("Error cleaning up booking:", cleanupError);
      }
      return res
        .status(500)
        .json({ message: "Failed to update booking with payment info" });
    }

    // Create BookingService entries if we have data
    if (bookingServiceData.length > 0) {
      try {
        const bookingServicePromises = bookingServiceData.map((serviceData) =>
          prisma.bookingService.create({
            data: {
              bookingId: booking.id,
              serviceId: serviceData.serviceId,
              price: serviceData.price,
            },
          })
        );

        await Promise.all(bookingServicePromises);
      } catch (bookingServiceError) {
        console.error("Error creating booking services:", bookingServiceError);
        // Clean up booking if booking services fail
        try {
          await prisma.booking.delete({ where: { id: booking.id } });
        } catch (cleanupError) {
          console.error(
            "Error cleaning up after booking service failure:",
            cleanupError
          );
        }
        return res
          .status(500)
          .json({ message: "Failed to create booking services" });
      }
    }

    // Create ephemeral key for the Customer
    // const ephemeralKey = await stripe.ephemeralKeys.create(
    //   { customer: req.user.stripe_customer_id },
    //   { apiVersion: "2025-03-31.basil" }
    // );

    // console.log("Ephemeral Key response => ", ephemeralKey);

    // // Calculate amount in cents for Stripe
    // const amountInCents = Math.floor(amount * 100);

    // console.log("Amount to be paid => ", amountInCents);

    // Create payment intent with essential metadata
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amountInCents,
    //   currency: "usd",
    //   payment_method_types: ["card"],
    //   customer: req.user.stripe_customer_id,
    //   metadata: {
    //     booking_id: booking.id,
    //     user_id: req.user.id,
    //     customer_id: req.user.id,
    //     source: source,
    //   },
    // });

    // console.log("Payment Intent created => ", paymentIntent);

    res.status(200).json({
      booking: {
        id: booking.id,
        duration: booking.duration,
        time: booking.time,
      },
      message: "Booking created successfully!",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a Booking against an ID
export const getUpcomingBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        userId: req.user.id,
        check_in: {
          gt: new Date(),
        },
      },
      orderBy: {
        check_in: "asc",
      },
      include: {
        user: true,
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
      return res.status(200).json({ message: "No upcoming booking found." });
    }

    // Format profile and bookingServices using utility functions
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

    // Add cancellation reason for cancelled bookings
    if (
      booking.status === BookingStatus.CANCELLED &&
      booking.cancellationReason
    ) {
      formattedBooking.cancellationReason = booking.cancellationReason;
    }

    res.status(200).json(formattedBooking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Start Booking API (Mark as In Progress)
export const startBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the booking and verify ownership
    const booking = await prisma.booking.findFirst({
      where: {
        id: id,
        customerId: req.user.id, // Ensure the booking belongs to the current user
      },
      include: {
        profile: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found or you don't have permission to start this booking",
      });
    }

    // Check if booking can be started
    if (booking.status === BookingStatus.CANCELLED) {
      return res.status(400).json({
        message: "Cannot start a cancelled booking",
      });
    }

    if (booking.status === BookingStatus.COMPLETED) {
      return res.status(400).json({
        message: "Booking is already completed",
      });
    }

    if (booking.status === BookingStatus.IN_PROGRESS) {
      return res.status(400).json({
        message: "Booking is already in progress",
      });
    }

    // Update booking status to IN_PROGRESS
    const updatedBooking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        status: BookingStatus.IN_PROGRESS,
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
      },
    });

    // Create notification for booking started
    await createNotification(
      req.user.id,
      updatedBooking.id,
      "Booking",
      `Your booking for ${
        updatedBooking.profile?.name || "the venue"
      } is now in progress`
    );

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
      message: "Booking started successfully",
      booking: formattedBooking,
    });
  } catch (error) {
    console.error("Error starting booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel Booking API
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

    // Find the booking and verify ownership
    const booking = await prisma.booking.findFirst({
      where: {
        id: id,
        customerId: req.user.id, // Ensure the booking belongs to the current user
      },
      include: {
        profile: true,
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

    // Check if booking is too close to check-in time (e.g., within 24 hours)
    // const checkInTime = new Date(booking.check_in);
    // const currentTime = new Date();
    // const timeDifference = checkInTime.getTime() - currentTime.getTime();
    // const hoursDifference = timeDifference / (1000 * 60 * 60);

    // if (hoursDifference < 24) {
    //   return res.status(400).json({
    //     message: "Cannot cancel booking within 24 hours of check-in time",
    //   });
    // }

    // Update booking status to CANCELLED and add cancellation reason
    const updatedBooking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: cancellationReason.trim(),
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
      },
    });

    // Update payment status to FAILED when booking is cancelled
    await prisma.booking.update({
      where: { id: id },
      data: {
        payment_status: PaymentStatus.FAILED,
        notes: `Booking cancelled: ${cancellationReason}`,
      },
    });

    // Create notification for booking cancellation
    await createNotification(
      req.user.id,
      updatedBooking.id,
      "Booking",
      `Your booking for ${
        updatedBooking.profile?.name || "the venue"
      } has been cancelled. Reason: ${cancellationReason}`
    );

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

    // Add cancellation reason
    formattedBooking.cancellationReason = updatedBooking.cancellationReason;

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: formattedBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};
