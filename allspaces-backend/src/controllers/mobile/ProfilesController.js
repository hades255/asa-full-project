import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { createNotification } from "../NotificationsController.js";
import axios from "axios";
import {
  getHotelsAgainstId,
  getHotelsAgainstKeyword,
  getHotelsRates,
  mapAccorHotelsDataSimple,
} from "../../utils/AccorApis.js";

const prisma = new PrismaClient();

// Get all profiles
export const getProfiles = async (req, res) => {
  try {
    console.log("Get profiles API called.....");

    const profiles = await prisma.profile.findMany({
      where: {
        source: "SPACE",
        status: {
          not: "INACTIVE",
        },
      },
      include: {
        facilities: true,
        services: {
          include: {
            media: true,
          },
        },
        medias: true,
        wishlists: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Format profiles according to the required structure
    const formattedProfiles = profiles.map((profile) => {
      // Calculate if profile is in user's wishlist
      const isInWishlist = profile.wishlists.some(
        (wishlist) => wishlist.userId === req.user?.id
      );

      // Format services
      const services = profile.services.map((service) => ({
        id: service?.id || "",
        name: service?.name || "",
        description: service?.description || "",
        minSpend: service.minSpend || 0,
        media: service?.media ? service.media.filePath || "" : null,
      }));

      // Format facilities
      const facilities = profile.facilities.map((facility) => ({
        id: facility.id || "",
        name: facility.name || "",
        description: "",
      }));

      // Format reviews
      const reviews = profile.reviews.map((review) => ({
        id: review.id || "",
        rating: review.rating || 0,
        comment: review.comment || "",
        createdAt: review.createdAt || "",
        user: {
          id: review.user.id || "",
          firstName: review.user.first_name || "",
          lastName: review.user.last_name || "",
          email: review.user.email || "",
        },
      }));

      // Format media
      const mediaItems = profile.medias.map((mediaItem) => ({
        id: mediaItem.id || "",
        url: mediaItem.filePath || "",
      }));

      // Return formatted profile
      return {
        id: profile.id || "",
        name: profile.name || "",
        description: profile.description || "",
        email: profile.email || "",
        location: profile.location || "",
        source: profile.source || "",
        coverMedia: profile.coverMedia || "",
        averageRating: profile.averageRating || 0,
        //eco_score: profile.eco_score || 0,
        totalReviews: profile.totalReviews || 0,
        rating: {
          oneStarCount: profile.oneStarCount || 0,
          twoStarCount: profile.twoStarCount || 0,
          threeStarCount: profile.threeStarCount || 0,
          fourStarCount: profile.fourStarCount || 0,
          fiveStarCount: profile.fiveStarCount || 0,
        },
        facilities: facilities,
        services: services,
        reviews: reviews,
        media: mediaItems,
        isInWishlist: isInWishlist,
      };
    });

    // Initialize accorProfiles as an empty array
    let accorProfiles = [];

    // try {
    //   // Fetch Accor hotels data
    //   const accorHotels = await getHotelsAgainstKeyword("hotel");
    //   const hotelCodes = accorHotels.results.map((item) => item.hotel.id);
    //   console.log("Hotel Codes are => ", hotelCodes);

    //   // Fetch Accor hotels rates
    //   const accorHotelsRates = await getHotelsRates(hotelCodes);

    //   // Map Accor data to local profile format
    //   accorProfiles = await mapAccorHotelsData(accorHotels, accorHotelsRates);
    //   console.log("mapAccorToLocalProfiles => ", accorProfiles);
    // } catch (accorError) {
    //   // Log the error but continue with the local profiles
    //   console.error("Error fetching Accor profiles:", accorError);
    //   console.log("Continuing with local profiles only");
    // }

    // Merge local and Accor profiles
    const mergedProfiles = [...formattedProfiles, ...accorProfiles];

    res.status(200).json(mergedProfiles);
  } catch (error) {
    console.error("Error fetching profiles:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all profiles
export const getProfilesFromAccor = async (req, res) => {
  try {
    const { category } = req.query;

    console.log("paramsssssssss => ", req.query);

    const accorHotels = await getHotelsAgainstId(category);
    // const accorHotels = await getHotelsAgainstKeyword(category);
    const hotelCodes = accorHotels.results.map((item) => item.hotel.id);

    console.log("Hotel Codes are => ", hotelCodes);

    const accorHotelsRates = await getHotelsRates(hotelCodes);

    const mapAccorToLocalProfiles = mapAccorHotelsDataSimple(
      accorHotels,
      accorHotelsRates
    );

    console.log("mapAccorToLocalProfiles => ", mapAccorToLocalProfiles);

    // res.status(200).json(mapAccorToLocalProfiles);

    res.status(200).json(mapAccorToLocalProfiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const { source = "SPACE" } = req.query; // Default to SPACE if not provided

    if (!["SPACE", "ACCOR"].includes(source))
      return res.status(400).json({ message: "Invalid source of profile" });

    let profile = null;

    if (source === "SPACE") {
      profile = await prisma.profile.findUnique({
        where: {
          id,
          status: {
            not: "INACTIVE",
          },
        },
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
          wishlists: true,
          reviews: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Calculate if profile is in user's wishlist
      const isInWishlist =
        profile.wishlists?.some(
          (wishlist) => wishlist.userId === req.user?.id
        ) || false;

      // Format services similar to main getProfileById
      const services = profile.services.map((service) => ({
        id: service?.id || "",
        name: service?.name || "",
        description: service?.description || "",
        minSpend: service.minSpend || 0,
        subCategoryId: service?.category?.id || null,
        categoryId: service?.category?.parent?.id || null,
        media: service?.media ? service.media.filePath || "" : null,
      }));

      // Format facilities
      const facilities = profile.facilities.map((facility) => ({
        id: facility.id || "",
        name: facility.name || "",
        description: "",
      }));

      // Format reviews
      const reviews =
        profile.reviews?.map((review) => ({
          id: review.id || "",
          rating: review.rating || 0,
          comment: review.comment || "",
          createdAt: review.createdAt || "",
          user: {
            id: review.user.id || "",
            firstName: review.user.first_name || "",
            lastName: review.user.last_name || "",
            email: review.user.email || "",
          },
        })) || [];

      // Format media
      const mediaItems = profile.medias.map((mediaItem) => ({
        id: mediaItem.id || "",
        url: mediaItem.filePath || "",
      }));

      // Create formatted profile object matching main getProfileById
      const formattedProfile = {
        id: profile.id || "",
        name: profile.name || "",
        description: profile.description || "",
        email: profile.email || "",
        location: {
          lat: profile.lat || 0,
          lng: profile.lng || 0,
        },
        address: profile.address || "",
        coverMedia: profile.coverMedia || "",
        source: "SPACE",
        status: profile.status || "",
        averageRating: profile.averageRating || 0,
        //   eco_score: profile.eco_score || 0,
        totalReviews: profile.totalReviews || 0,
        price: profile.services.reduce(
          (sum, service) => sum + (service.minSpend || 0),
          0
        ),
        rating: {
          oneStarCount: profile.oneStarCount || 0,
          twoStarCount: profile.twoStarCount || 0,
          threeStarCount: profile.threeStarCount || 0,
          fourStarCount: profile.fourStarCount || 0,
          fiveStarCount: profile.fiveStarCount || 0,
        },
        facilities: facilities,
        services: services,
        reviews: reviews,
        media: mediaItems,
        isInWishlist: isInWishlist,
      };

      res.status(200).json(formattedProfile);
    } else {
      console.log("This is a Accor profile flow...");
      const accorHotels = await getHotelsAgainstId(id);
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
      profile = mapAccorToLocalProfiles?.[0];
      console.log("mapAccorToLocalProfiles => ", profile);

      if (!profile)
        return res
          .status(401)
          .json({ message: "Sorry, no profile found against ID" });

      res.status(200).json(profile);
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search Profiles by categories
export const getProfilesAgainstCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res
        .status(400)
        .json({ message: "Category is required for search" });
    }

    const profiles = await prisma.profile.findMany({
      where: {
        source: "SPACE",
        status: {
          not: "INACTIVE",
        },
        services: {
          some: {
            category: {
              title: {
                contains: category,
                mode: "insensitive",
              },
            },
          },
        },
      },
      include: {
        facilities: true,
        services: {
          include: {
            media: true,
          },
        },
        medias: true,
        wishlists: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // console.log("profiles => ", profiles);

    const profilesWithWishlistStatus = profiles.map((profile) => ({
      ...profile,
      source: "SPACE",
      price: profile.services.reduce(
        (sum, service) => sum + (service.minSpend || 0),
        0
      ),
      isInWishlist: profile.wishlists.some(
        (wishlist) => wishlist.userId === req.user.id
      ),
    }));

    res.status(200).json(profilesWithWishlistStatus);
  } catch (error) {
    console.error("Error searching profiles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Group all Profiles by categories
export const getProfilesGroupedByCategories = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        source: "SPACE",
        status: {
          not: "INACTIVE",
        },
        services: {
          some: {
            categoryId: {
              not: null,
            },
          },
        },
      },
      include: {
        facilities: true,
        services: {
          include: {
            category: true,
          },
        },
        medias: true,
        wishlists: true,
      },
    });

    const profilesEnhanced = profiles.map((profile) => ({
      ...profile,
      source: "SPACE",
      price: profile.services.reduce(
        (sum, service) => sum + (service.minSpend || 0),
        0
      ),
    }));

    // Group profiles by category title (using the first service's category)
    const groupedProfiles = profilesEnhanced.reduce((acc, profile) => {
      const firstService = profile.services[0];
      const categoryTitle = firstService?.category?.title || "Uncategorized";

      if (!acc[categoryTitle]) {
        acc[categoryTitle] = [];
      }

      acc[categoryTitle].push(profile);
      return acc;
    }, {});

    const groupedProfilesArray = Object.entries(groupedProfiles).map(
      ([categoryName, profiles]) => ({
        categoryName,
        profiles,
      })
    );

    res.status(200).json(groupedProfilesArray);
  } catch (error) {
    console.error("Error searching profiles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get list of categories used in profiles
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        orderIndex: "asc",
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error searching profiles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews against a profile ID
export const getReviewsForProfile = async (req, res) => {
  try {
    const { profile_id } = req.params;

    if (!profile_id) {
      return res.status(400).json({ error: "Profile ID is missed" });
    }

    let reviews = await prisma.review.findMany({
      where: { profileId: profile_id },
      include: {
        user: true,
      },
    });

    console.log("Reviews => ", reviews);

    let userIds = reviews.map(
      (review) => `user_id=${review.user.clerk_user_id}`
    );
    console.log("User IDs => ", userIds);
    userIds = [...new Set(userIds)];
    console.log("Unique User IDs => ", userIds);

    // // Verify session with Clerk API
    if (userIds.length > 0) {
      const clerkApiKey = process.env.CLERK_SECRET_KEY;
      const clerkUsers = await axios.get(
        `https://api.clerk.com/v1/users/?${userIds.join("&")}`,
        {
          headers: {
            Authorization: `Bearer ${clerkApiKey}`,
          },
        }
      );
      console.log("------------------------", "response => ", clerkUsers.data);

      const updatedReviews = reviews.map((review) => {
        // Find the corresponding user data from Clerk response
        const userData = clerkUsers.data.find(
          (user) => user.id === review.user.clerk_user_id
        );

        // Update first_name and last_name in review if user data exists
        return {
          ...review,
          user: {
            ...review.user,
            first_name: userData?.first_name,
            last_name: userData?.last_name,
            profile_image_url: userData?.profile_image_url,
          },
        };
      });

      console.log(updatedReviews);
      reviews = updatedReviews;
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
