import pkg from "@prisma/client";
const { PrismaClient, ProfileStatus } = pkg;
import fs from "fs";
import path from "path";
import {
  uploadFileToS3,
  deleteFileFromS3,
  generateUniqueFileName,
} from "../services/S3Service.js";
import { formatProfile } from "../utils/profileFormatter.js";
import {
  getHotelsAgainstKeyword,
  getHotelsRates,
  mapAccorHotelsDataSimple,
  mapAccorHotelsDataEnhanced,
} from "../utils/AccorApis.js";

const prisma = new PrismaClient();

// This function would replace the current categorizeServicesByName function
// after the database migration is applied
const getServicesByCategories = async (options) => {
  const {
    workspaceOptions = [],
    relaxationServices = [],
    leisureServices = [],
    diningOptions = [],
    sleepOptions = [],
    travelOptions = [],
  } = options;

  // Build the service query based on selected categories
  let serviceQuery = [];

  if (workspaceOptions.length > 0) {
    if (workspaceOptions.includes("Other")) {
      // Include all workspace services
      serviceQuery.push({ category: "WORKSPACE" });
    } else {
      // Include only specific workspace services
      serviceQuery.push({
        AND: [
          { category: "WORKSPACE" },
          { name: { in: workspaceOptions, mode: "insensitive" } },
        ],
      });
    }
  }

  if (relaxationServices.length > 0) {
    if (relaxationServices.includes("Other")) {
      // Include all relaxation services
      serviceQuery.push({ category: "RELAXATION" });
    } else {
      // Include only specific relaxation services
      serviceQuery.push({
        AND: [
          { category: "RELAXATION" },
          { name: { in: relaxationServices, mode: "insensitive" } },
        ],
      });
    }
  }

  if (leisureServices.length > 0) {
    if (leisureServices.includes("Other")) {
      // Include all leisure services
      serviceQuery.push({ category: "LEISURE" });
    } else {
      // Include only specific leisure services
      serviceQuery.push({
        AND: [
          { category: "LEISURE" },
          { name: { in: leisureServices, mode: "insensitive" } },
        ],
      });
    }
  }

  if (diningOptions.length > 0) {
    if (diningOptions.includes("Other")) {
      // Include all dining services
      serviceQuery.push({ category: "DINING" });
    } else {
      // Include only specific dining services
      serviceQuery.push({
        AND: [
          { category: "DINING" },
          { name: { in: diningOptions, mode: "insensitive" } },
        ],
      });
    }
  }

  if (sleepOptions.length > 0) {
    // Include sleep services
    serviceQuery.push({ category: "SLEEP" });
  }

  if (travelOptions.length > 0) {
    // Include travel services
    serviceQuery.push({ category: "TRAVEL" });
  }

  // If no specific categories are selected, return empty array
  if (serviceQuery.length === 0) {
    return [];
  }

  // Find services matching any of the category conditions
  const services = await prisma.service.findMany({
    where: {
      OR: serviceQuery,
    },
    select: { id: true },
  });

  return services.map((service) => service.id);
};

//  Search profiles with pagination and filtering
export const searchAllProfiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoryIds,
      pricing, // New: { min: number, max: number }
      rating, // New: { min: number, max: number }
      sort = "createdAt",
      sortOrder = "desc", // Default search name with timestamp
      location = { lat: 0, lng: 0 }, // Location coordinates
    } = req.body;

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

    // Normalize categoryIds
    let categoryIdsArray = [];
    if (categoryIds) {
      if (Array.isArray(categoryIds)) {
        categoryIdsArray = categoryIds;
      } else if (typeof categoryIds === "string") {
        try {
          categoryIdsArray = JSON.parse(categoryIds);
        } catch {
          categoryIdsArray = [categoryIds];
        }
      }
    }

    // Build filter conditions for profiles
    let profileFilterConditions = [];
    let profileIds = [];

    // Filter by categories if provided
    if (categoryIdsArray.length > 0) {
      const profilesWithCategories = await prisma.profile.findMany({
        where: {
          services: {
            some: {
              categoryId: { in: categoryIdsArray },
            },
          },
        },
        select: { id: true },
      });
      profileIds = profilesWithCategories.map((profile) => profile.id);
      profileFilterConditions.push({ id: { in: profileIds } });
    }

    // If no profiles found with the filters, return empty result
    if (categoryIdsArray.length > 0 && profileIds.length === 0) {
      return res.status(200).json({
        data: [],
        pagination: {
          total: 0,
          page: pageNumber,
          limit: limitNumber,
          pages: 0,
        },
      });
    }

    // Enhanced where clause with all filters
    const whereClause = {
      status: "PUBLISHED", // Only search for published profiles
      ...(profileFilterConditions.length > 0
        ? { AND: profileFilterConditions }
        : {}),

      // Location-based filtering (approximately 10km radius)
      ...(location.lat !== 0 && location.lng !== 0
        ? {
            AND: [
              { lat: { not: null } },
              { lng: { not: null } },
              {
                OR: [
                  // Profiles within approximately 10km (0.1 degrees ≈ 11km)
                  {
                    AND: [
                      { lat: { gte: location.lat - 0.1 } },
                      { lat: { lte: location.lat + 0.1 } },
                      { lng: { gte: location.lng - 0.1 } },
                      { lng: { lte: location.lng + 0.1 } },
                    ],
                  },
                ],
              },
            ],
          }
        : {}),

      // Pricing filter
      ...(pricing && (pricing.min !== undefined || pricing.max !== undefined)
        ? {
            services: {
              some: {
                minSpend: {
                  ...(pricing.min !== undefined ? { gte: pricing.min } : {}),
                  ...(pricing.max !== undefined ? { lte: pricing.max } : {}),
                },
              },
            },
          }
        : {}),

      // Rating filter
      ...(rating && (rating.min !== undefined || rating.max !== undefined)
        ? {
            averageRating: {
              ...(rating.min !== undefined ? { gte: rating.min } : {}),
              ...(rating.max !== undefined ? { lte: rating.max } : {}),
            },
          }
        : {}),
    };

    const totalProfiles = await prisma.profile.count({ where: whereClause });
    const totalPages = Math.ceil(totalProfiles / limitNumber);

    // Determine sort field based on user's request
    let orderBy = { [sort]: sortOrder };

    const profiles = await prisma.profile.findMany({
      where: whereClause,
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
      orderBy,
      skip,
      take: limitNumber,
    });

    // Format profiles according to the required structure
    const formattedProfiles = profiles.map((profile) => {
      // Calculate if profile is in user's wishlist
      const isInWishlist =
        profile.wishlists?.some(
          (wishlist) => wishlist.userId === req.user?.id
        ) || false;

      // Format services
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

      // Return formatted profile
      return {
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
        source: profile.source || "",
        averageRating: profile.averageRating || 0,
        // eco_score: profile.eco_score || 0,
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

    let accorProfiles = [];

    try {
      // Fetch Accor hotels data based on location
      const accorHotels = await getHotelsAgainstKeyword("hotel", location);

      // Check if accorHotels and results exist
      if (
        !accorHotels ||
        !accorHotels.results ||
        !Array.isArray(accorHotels.results)
      ) {
        console.log("No Accor hotels found or invalid response format");
        accorProfiles = [];
      } else {
        const hotelCodes = accorHotels.results.map((item) => item.hotel.id);
        console.log("Hotel Codes are => ", hotelCodes);

        // Fetch Accor hotels rates
        const accorHotelsRates = await getHotelsRates(hotelCodes);

        // Enhanced mapping with additional API calls for each hotel
        accorProfiles = await mapAccorHotelsDataEnhanced(
          accorHotels,
          accorHotelsRates
        );
        console.log("Enhanced Accor profiles => ", accorProfiles);
      }
    } catch (accorError) {
      // Log the error but continue with the local profiles
      console.error("Error fetching Accor profiles:", accorError);
      console.log("Continuing with local profiles only");
      accorProfiles = [];
    }

    // Always save search preferences
    const searchName = `Search ${new Date().toLocaleString()}`;
    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: req.user.id,
        name: searchName,
        filters: {
          page,
          limit,
          categoryIds: categoryIdsArray,
          pricing,
          rating,
          sort,
          sortOrder,
          location,
        },
      },
    });

    // Merge local and Accor profiles
    const mergedProfiles = [...formattedProfiles, ...accorProfiles];

    res.status(200).json({
      data: mergedProfiles,
      pagination: {
        total: totalProfiles + accorProfiles.length,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil((totalProfiles + accorProfiles.length) / limitNumber),
      },
      savedSearchId: savedSearch.id,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { id },
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

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Calculate if profile is in user's wishlist
    const isInWishlist =
      profile.wishlists?.some((wishlist) => wishlist.userId === req.user?.id) ||
      false;

    // Format profile using utility function
    const formattedProfile = formatProfile(profile, { isInWishlist });

    res.status(200).json(formattedProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Create Profile with Services, Facilities, and Media using S3 for file storage
 */
export const createProfileWithDetails = async (req, res) => {
  try {
    const {
      name,
      description,
      email,
      status,
      location,
      serviceIds,
      facilities,
    } = req.body;
    const userId = req.user.id; // Authenticated user ID

    if (!name) {
      return res.status(400).json({ message: "Profile name is required." });
    }

    // Check if user already has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({
        message:
          "User already has a profile. Only one profile per user is allowed.",
      });
    }

    // Parse facilities JSON data
    const parsedFacilities = facilities ? JSON.parse(facilities) : [];

    // Log the received serviceIds for debugging
    console.log("Received serviceIds:", serviceIds);
    console.log("Type of serviceIds:", typeof serviceIds);

    // Handle serviceIds based on what we actually received
    let servicesToUse = [];

    if (serviceIds) {
      // If it's already an array, use it directly
      if (Array.isArray(serviceIds)) {
        servicesToUse = serviceIds;
      }
      // If it's a string that looks like an array, parse it
      else if (
        typeof serviceIds === "string" &&
        serviceIds.startsWith("[") &&
        serviceIds.endsWith("]")
      ) {
        try {
          servicesToUse = JSON.parse(serviceIds);
        } catch (e) {
          console.error("Error parsing serviceIds:", e);
          return res.status(400).json({
            message:
              "Invalid serviceIds format. Must be a JSON string array or an array.",
            received: serviceIds,
            error: e.message,
          });
        }
      }
      // Handle case where a single ID is passed (not in array format)
      else if (typeof serviceIds === "string") {
        servicesToUse = [serviceIds];
      }
    }

    console.log("Processed serviceIds for use:", servicesToUse);

    // Create Profile
    const profile = await prisma.profile.create({
      data: {
        name,
        description,
        email,
        status,
        location,
        userId,
      },
    });

    // Create Services associations (if provided)
    let services = [];
    if (servicesToUse.length > 0) {
      // Verify that all services exist
      const existingServices = await prisma.service.findMany({
        where: {
          id: { in: servicesToUse },
        },
      });

      if (existingServices.length !== servicesToUse.length) {
        return res.status(400).json({
          message: "One or more service IDs are invalid",
          found: existingServices.length,
          requested: servicesToUse.length,
          requestedIds: servicesToUse,
        });
      }

      // Update services to link them to this profile
      services = await Promise.all(
        servicesToUse.map(async (serviceId) => {
          return await prisma.service.update({
            where: { id: serviceId },
            data: {
              profileId: profile.id,
            },
          });
        })
      );
    }

    // Create Facilities (if provided)
    if (parsedFacilities.length > 0) {
      await prisma.facility.createMany({
        data: parsedFacilities.map((facility) => ({
          name: facility.name,
          profileId: profile.id,
        })),
      });
    }

    // Handle Media Upload to S3
    let mediaRecords = [];
    if (req.files && req.files.length > 0) {
      mediaRecords = await Promise.all(
        req.files.map(async (file) => {
          const fileType = getFileTypeEnum(file.mimetype); // Convert MIME to enum
          if (!fileType) {
            return res.status(400).json({
              message: `Invalid file type: ${file.mimetype}. Only PNG, JPG, and JPEG images are allowed.`,
            });
          }

          try {
            // Generate a unique filename
            const uniqueFileName = generateUniqueFileName(file.originalname);

            // Upload file to S3
            const s3FileUrl = await uploadFileToS3(
              file.buffer,
              uniqueFileName,
              file.mimetype
            );

            // Create media record in database
            return await prisma.media.create({
              data: {
                filePath: s3FileUrl, // Store the full S3 URL
                fileType, // Store enum value
                profileId: profile.id,
              },
            });
          } catch (error) {
            console.error("Error uploading file to S3:", error);
            throw error; // Let Promise.all catch this
          }
        })
      ).catch((error) => {
        console.error("Error processing files:", error);
        throw new Error("Failed to process one or more media files");
      });
    }

    // Get the updated profile with all relations
    const createdProfile = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: {
        facilities: true,
        services: {
          include: {
            media: true,
          },
        },
        medias: true,
      },
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile: createdProfile,
      media: mediaRecords,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Create profile with S3 file upload
export const createProfile = async (req, res) => {
  try {
    const { name, description, email, location, address } = req.body;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Validate required fields
    if (!name || !description || !email || !location || !address) {
      return res.status(400).json({
        message:
          "All fields are required: name, description, email, location, address",
      });
    }

    // Handle location parsing - it might come as a string or object
    let parsedLocation = location;
    if (typeof location === "string") {
      try {
        parsedLocation = JSON.parse(location);
      } catch (error) {
        return res.status(400).json({
          message: "location must be a valid JSON object or string",
        });
      }
    }

    // Validate location object structure
    if (
      !parsedLocation ||
      typeof parsedLocation !== "object" ||
      !parsedLocation.lat ||
      !parsedLocation.lng
    ) {
      return res.status(400).json({
        message: "location object must contain lat and lng properties",
        received: location,
        parsed: parsedLocation,
      });
    }

    // Validate lat and lng are valid numbers
    if (
      isNaN(parseFloat(parsedLocation.lat)) ||
      isNaN(parseFloat(parsedLocation.lng))
    ) {
      return res.status(400).json({
        message: "location.lat and location.lng must be valid numbers",
      });
    }

    // // Validate eco_score is provided and is a number
    // if (
    //   eco_score === undefined ||
    //   eco_score === null ||
    //   isNaN(parseInt(eco_score))
    // ) {
    //   return res.status(400).json({
    //     message: "eco_score is required and must be a valid number",
    //   });
    // }

    // Validate coverMedia is provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "coverMedia is required. Please upload at least one image.",
      });
    }

    // Check if user already has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (existingProfile) {
      return res.status(400).json({
        message:
          "User already has a profile. Only one profile per user is allowed.",
      });
    }

    // Handle Multiple Media Uploads to S3
    let coverMediaUrl = null;
    const uploadedMediaFiles = [];

    console.log("Files exist => ", req.files);

    if (req.files && req.files.length > 0) {
      // Process each uploaded file
      for (const file of req.files) {
        console.log("Processing file => ", file.originalname);
        const fileType = getFileTypeEnum(file.mimetype);

        if (!fileType) {
          return res.status(400).json({
            message: `Invalid file type: ${file.mimetype}. Only PNG, JPG, and JPEG images are allowed.`,
          });
        }

        try {
          // Generate a unique filename
          const uniqueFileName = generateUniqueFileName(file.originalname);

          // Upload file to S3
          const fileUrl = await uploadFileToS3(
            file.buffer,
            uniqueFileName,
            file.mimetype
          );

          console.log("File uploaded to S3, URL => ", fileUrl);

          // Add to the list of uploaded files
          uploadedMediaFiles.push({
            url: fileUrl,
            fileType,
            originalName: file.originalname,
          });

          // Use the first image as the cover media
          if (!coverMediaUrl) {
            coverMediaUrl = fileUrl;
          }
        } catch (error) {
          console.error("Error uploading file to S3:", error);
          return res.status(500).json({
            message: "Error uploading file to S3",
            error: error.message,
          });
        }
      }
    }

    console.log("coverMedia URL => ", coverMediaUrl);

    // Create the profile in the database using a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the profile
      const newProfile = await prisma.profile.create({
        data: {
          name,
          description,
          email,
          status: "INACTIVE",
          //  eco_score: parseInt(eco_score),
          lat: parseFloat(parsedLocation.lat),
          lng: parseFloat(parsedLocation.lng),
          address,
          coverMedia: coverMediaUrl,
          userId: req.user.id, // Associate with the logged-in user
        },
      });

      // Create media entries for uploaded files (skip the first one as it's used for coverMedia)
      // Only add additional images to the media table
      if (uploadedMediaFiles.length > 1) {
        await prisma.media.createMany({
          data: uploadedMediaFiles.slice(1).map((file) => ({
            filePath: file.url,
            fileType: file.fileType,
            profileId: newProfile.id,
          })),
        });
      }

      // Return the profile with associated media
      return await prisma.profile.findUnique({
        where: { id: newProfile.id },
        include: {
          medias: true,
        },
      });
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile: result,
      mediaCount:
        uploadedMediaFiles.length > 0 ? uploadedMediaFiles.length - 1 : 0, // Excluding coverMedia
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile with S3 file handling
export const updateProfile = async (req, res) => {
  try {
    console.log("profile update payload => ", req.body);

    const { id } = req.params;
    const { name, description, email, location, address } = req.body;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Validate required fields
    if (!name || !description || !email || !location || !address) {
      return res.status(400).json({
        message:
          "All fields are required: name, description, email, location, address",
      });
    }

    // Handle location parsing - it might come as a string or object
    let parsedLocation = location;
    if (typeof location === "string") {
      try {
        parsedLocation = JSON.parse(location);
      } catch (error) {
        return res.status(400).json({
          message: "location must be a valid JSON object or string",
        });
      }
    }

    // Validate location object structure
    if (
      !parsedLocation ||
      typeof parsedLocation !== "object" ||
      !parsedLocation.lat ||
      !parsedLocation.lng
    ) {
      return res.status(400).json({
        message: "location object must contain lat and lng properties",
        received: location,
        parsed: parsedLocation,
      });
    }

    // Validate lat and lng are valid numbers
    if (
      isNaN(parseFloat(parsedLocation.lat)) ||
      isNaN(parseFloat(parsedLocation.lng))
    ) {
      return res.status(400).json({
        message: "location.lat and location.lng must be valid numbers",
      });
    }

    // // Validate eco_score is provided and is a number
    // if (
    //   eco_score === undefined ||
    //   eco_score === null ||
    //   isNaN(parseInt(eco_score))
    // ) {
    //   return res.status(400).json({
    //     message: "eco_score is required and must be a valid number",
    //   });
    // }

    const profile = await prisma.profile.findFirst({
      where: { id },
    });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Handle Multiple Media Uploads to S3
    let coverMediaUrl = profile.coverMedia;
    const uploadedMediaFiles = [];

    console.log("Files exist => ", req.files);

    if (req.files && req.files.length > 0) {
      // Delete old cover media from S3 if it exists and is an S3 URL
      if (profile.coverMedia && profile.coverMedia.includes("amazonaws.com")) {
        try {
          console.log("Deleting old cover media from S3");
          await deleteFileFromS3(profile.coverMedia);
          console.log("Old cover media deleted from S3");
        } catch (error) {
          console.warn("Error deleting cover media from S3:", error);
          // Continue with the update even if deletion fails
        }
      }
      // Handle legacy local file deletion
      else if (
        profile.coverMedia &&
        profile.coverMedia.startsWith("/uploads/")
      ) {
        console.log("Deleting old local file");

        // Ensure the coverMedia has no leading slash (if it exists)
        const fileName = profile.coverMedia.startsWith("/")
          ? profile.coverMedia.substring(1)
          : profile.coverMedia;

        // Use the absolute path to the file with process.cwd() to get the project root
        const oldPath = path.join(process.cwd(), fileName);

        console.log("Old path => ", oldPath);

        // Check if the file exists before trying to delete
        if (fs.existsSync(oldPath)) {
          console.log("File exists and unlinking it");
          fs.unlink(oldPath, (err) => {
            if (err) {
              console.warn("Error deleting file:", err);
            } else {
              console.log("Old file deleted:", oldPath);
            }
          });
        }
      }

      // Process each uploaded file
      for (const file of req.files) {
        console.log("Processing file => ", file.originalname);
        const fileType = getFileTypeEnum(file.mimetype);

        if (!fileType) {
          return res.status(400).json({
            message: `Invalid file type: ${file.mimetype}. Only PNG, JPG, and JPEG images are allowed.`,
          });
        }

        try {
          // Generate a unique filename
          const uniqueFileName = generateUniqueFileName(file.originalname);

          // Upload file to S3
          const fileUrl = await uploadFileToS3(
            file.buffer,
            uniqueFileName,
            file.mimetype
          );

          console.log("File uploaded to S3, URL => ", fileUrl);

          // Add to the list of uploaded files
          uploadedMediaFiles.push({
            url: fileUrl,
            fileType,
            originalName: file.originalname,
          });

          // Use the first image as the cover media
          if (!coverMediaUrl || coverMediaUrl === profile.coverMedia) {
            coverMediaUrl = fileUrl;
          }
        } catch (error) {
          console.error("Error uploading file to S3:", error);
          return res.status(500).json({
            message: "Error uploading file to S3",
            error: error.message,
          });
        }
      }
    }

    console.log("coverMedia URL => ", coverMediaUrl);

    // Update the profile in the database using a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update the profile
      const updatedProfile = await prisma.profile.update({
        where: { id },
        data: {
          name,
          description,
          email,
          lat: parseFloat(parsedLocation.lat),
          lng: parseFloat(parsedLocation.lng),
          address,
          // eco_score: parseInt(eco_score),
          coverMedia: coverMediaUrl,
        },
      });

      // Create media entries for uploaded files (skip the first one as it's used for coverMedia)
      // Only add additional images to the media table
      if (uploadedMediaFiles.length > 1) {
        await prisma.media.createMany({
          data: uploadedMediaFiles.slice(1).map((file) => ({
            filePath: file.url,
            fileType: file.fileType,
            profileId: updatedProfile.id,
          })),
        });
      }

      // Return the profile with associated media
      return await prisma.profile.findUnique({
        where: { id: updatedProfile.id },
        include: {
          facilities: true,
          services: {
            include: {
              media: true,
              category: true,
            },
          },
          medias: true,
          reviews: {
            include: {
              user: true,
            },
          },
        },
      });
    });

    console.log("Updated Profile => ", result);

    res.status(200).json({
      message: "Profile updated successfully",
      profile: result,
      mediaCount:
        uploadedMediaFiles.length > 0 ? uploadedMediaFiles.length - 1 : 0, // Excluding coverMedia
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.profile.delete({ where: { id } });

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFileTypeEnum = (mimeType) => {
  const mimeToEnum = {
    "image/jpeg": "JPG",
    "image/jpg": "JPG",
    "image/png": "PNG",
  };
  return mimeToEnum[mimeType] || null;
};

// Get all saved searches for a user
export const getSavedSearches = async (req, res) => {
  try {
    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(savedSearches);
  } catch (error) {
    console.error("Error fetching saved searches:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get saved search by ID
export const getSavedSearchById = async (req, res) => {
  try {
    const { id } = req.params;

    const savedSearch = await prisma.savedSearch.findFirst({
      where: {
        id,
        userId: req.user.id, // Ensure the saved search belongs to the user
      },
    });

    if (!savedSearch) {
      return res.status(404).json({ message: "Saved search not found" });
    }

    res.status(200).json(savedSearch);
  } catch (error) {
    console.error("Error fetching saved search:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Execute a saved search by ID
export const executeSavedSearch = async (req, res) => {
  try {
    const { id } = req.params;

    const savedSearch = await prisma.savedSearch.findFirst({
      where: {
        id,
        userId: req.user.id, // Ensure the saved search belongs to the user
      },
    });

    if (!savedSearch) {
      return res.status(404).json({ message: "Saved search not found" });
    }

    // Extract the filters from the saved search
    const filters = savedSearch.filters;

    // Use the filters to execute the search
    // We'll reuse the request body structure from searchAllProfiles
    req.body = {
      ...filters,
      save: false, // Don't save this search again
    };

    // Call searchAllProfiles with the saved filters
    return await searchAllProfiles(req, res);
  } catch (error) {
    console.error("Error executing saved search:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a saved search
export const updateSavedSearch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, filters } = req.body;

    // Check if the saved search exists and belongs to the user
    const existingSavedSearch = await prisma.savedSearch.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingSavedSearch) {
      return res.status(404).json({ message: "Saved search not found" });
    }

    // Update the saved search
    const updatedSavedSearch = await prisma.savedSearch.update({
      where: { id },
      data: {
        name: name || existingSavedSearch.name,
        filters: filters || existingSavedSearch.filters,
      },
    });

    res.status(200).json({
      message: "Saved search updated successfully",
      savedSearch: updatedSavedSearch,
    });
  } catch (error) {
    console.error("Error updating saved search:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a saved search
export const deleteSavedSearch = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the saved search exists and belongs to the user
    const existingSavedSearch = await prisma.savedSearch.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingSavedSearch) {
      return res.status(404).json({ message: "Saved search not found" });
    }

    // Delete the saved search
    await prisma.savedSearch.delete({
      where: { id },
    });

    res.status(200).json({ message: "Saved search deleted successfully" });
  } catch (error) {
    console.error("Error deleting saved search:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get auto-suggestions for search
export const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(200).json({ suggestions: [] });
    }

    // Search for profiles that match the query
    const profileSuggestions = await prisma.profile.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        id: true,
        category: {
          select: {
            title: true,
          },
        },
      },
      take: 5,
    });

    // Search for services that match the query
    const serviceSuggestions = await prisma.service.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        id: true,
      },
      take: 5,
    });

    // Search for facilities that match the query
    const facilitySuggestions = await prisma.facility.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        id: true,
        profileId: true,
      },
      take: 5,
    });

    // Generate common search terms based on predefined categories
    const commonSearchTerms = [
      "Meeting Room",
      "Business Room",
      "Conference Room",
      "Event Space",
      "Spa",
      "Massage",
      "Beach Club",
      "Gym",
      "Swimming Pool",
      "Fitness Class",
      "Breakfast",
      "Lunch",
      "Dinner",
      "Vegan",
      "Halal",
      "Gluten-Free",
      "Wi-Fi",
      "Projector",
      "Catering",
    ]
      .filter((term) => term.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    // Format the suggestions
    const formattedSuggestions = {
      profiles: profileSuggestions.map((profile) => ({
        id: profile.id,
        text: profile.name,
        type: "profile",
      })),
      services: serviceSuggestions.map((service) => ({
        id: service.id,
        text: service.name,
        type: "service",
      })),
      facilities: facilitySuggestions.map((facility) => ({
        id: facility.id,
        text: facility.name,
        type: "facility",
        profileId: facility.profileId,
      })),
      common: commonSearchTerms.map((term) => ({
        text: term,
        type: "common",
      })),
    };

    // Combine all suggestions and sort by relevance
    // Here we prioritize exact matches and then alphabetical order
    const allSuggestions = [
      ...formattedSuggestions.profiles,
      ...formattedSuggestions.services,
      ...formattedSuggestions.facilities,
      ...formattedSuggestions.common,
    ].sort((a, b) => {
      // Exact matches first
      if (a.text.toLowerCase() === query.toLowerCase()) return -1;
      if (b.text.toLowerCase() === query.toLowerCase()) return 1;

      // Then sort by whether it starts with the query
      const aStartsWith = a.text.toLowerCase().startsWith(query.toLowerCase());
      const bStartsWith = b.text.toLowerCase().startsWith(query.toLowerCase());
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Finally sort alphabetically
      return a.text.localeCompare(b.text);
    });

    res.status(200).json({
      suggestions: allSuggestions.slice(0, 10), // Limit to top 10 suggestions
      categories: {
        profiles: formattedSuggestions.profiles,
        services: formattedSuggestions.services,
        facilities: formattedSuggestions.facilities,
        common: formattedSuggestions.common,
      },
    });
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get profile by user ID (returns single profile since one-to-one relationship)
export const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        facilities: true,
        services: {
          include: {
            media: true,
            category: true,
          },
        },
        medias: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            roles: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(200).json({
        message: "No profile found for this user",
        profile: null,
        isProfileCompleted: false,
      });
    }

    // Check if profile is completed (has at least one facility and one service)
    const hasFacilities = profile.facilities && profile.facilities.length > 0;
    const hasServices = profile.services && profile.services.length > 0;
    const isProfileCompleted = hasFacilities && hasServices;

    // Add the isProfileCompleted field to the response
    const profileWithCompletionStatus = {
      ...profile,
      isProfileCompleted,
    };

    res.status(200).json(profileWithCompletionStatus);
  } catch (error) {
    console.error(
      `Error fetching profile for user ${req.params.userId}:`,
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get profile for the currently authenticated user (returns single profile since one-to-one relationship)
export const getMyProfile = async (req, res) => {
  try {
    // Use the authenticated user's ID from the request
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
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
    });

    if (!profile) {
      return res.status(200).json({
        message: "You don't have a profile yet",
        profile: null,
        isProfileCompleted: false,
      });
    }

    // Check if profile is completed (has at least one facility and one service)
    const hasFacilities = profile.facilities && profile.facilities.length > 0;
    const hasServices = profile.services && profile.services.length > 0;
    const isProfileCompleted = hasFacilities && hasServices;

    // Format services similar to searchAllProfiles
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

    // Create formatted profile object
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
      source: profile.source || "",
      status: profile.status || "",
      averageRating: profile.averageRating || 0,
      // eco_score: profile.eco_score || 0,
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
    };

    // Add the isProfileCompleted field to the response
    const profileWithCompletionStatus = {
      profile: formattedProfile,
      isProfileCompleted,
    };

    res.status(200).json(profileWithCompletionStatus);
  } catch (error) {
    console.error(`Error fetching profile for current user:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle profile status (INACTIVE ↔ PUBLISHED)
export const toggleProfileStatus = async (req, res) => {
  try {
    // Use the authenticated user's ID from the request
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get the user's profile with facilities and services
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        facilities: true,
        services: {
          include: {
            media: true,
            category: true,
          },
        },
        medias: true,
      },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Please create a profile first.",
      });
    }

    // Check if profile is completed (has at least one facility and one service)
    const hasFacilities = profile.facilities && profile.facilities.length > 0;
    const hasServices = profile.services && profile.services.length > 0;
    const isProfileCompleted = hasFacilities && hasServices;

    // Determine the new status
    const currentStatus = profile.status;
    let newStatus;
    let message;

    if (currentStatus === "INACTIVE") {
      // Trying to publish - check if profile is complete
      if (!isProfileCompleted) {
        return res.status(400).json({
          message:
            "Cannot publish profile. Profile must be complete with at least one facility and one service.",
          isProfileCompleted: false,
          missingRequirements: {
            hasFacilities,
            hasServices,
          },
        });
      }
      newStatus = "PUBLISHED";
      message = "Profile published successfully";
    } else if (currentStatus === "PUBLISHED") {
      // Trying to deactivate - always allowed
      newStatus = "INACTIVE";
      message = "Profile deactivated successfully";
    } else {
      return res.status(400).json({
        message: "Invalid profile status",
        currentStatus,
      });
    }

    // Update the profile status
    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: { status: newStatus },
      include: {
        facilities: true,
        services: {
          include: {
            media: true,
            category: true,
          },
        },
        medias: true,
      },
    });

    // Add completion status to response
    const profileWithCompletionStatus = {
      ...updatedProfile,
      isProfileCompleted,
    };

    res.status(200).json({
      message,
      profile: profileWithCompletionStatus,
      statusChanged: {
        from: currentStatus,
        to: newStatus,
      },
    });
  } catch (error) {
    console.error(`Error toggling profile status:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get available filters for profile search
export const getAvailableFilters = async (req, res) => {
  try {
    // Get all categories with their subcategories
    const categories = await prisma.category.findMany({
      where: {
        parentId: null, // Only parent categories
      },
      include: {
        subcategories: {
          select: {
            id: true,
            title: true,
            image: true,
            orderIndex: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    // Get price ranges from services
    const servicePrices = await prisma.service.findMany({
      where: {
        minSpend: {
          not: null,
        },
      },
      select: {
        minSpend: true,
      },
      orderBy: {
        minSpend: "asc",
      },
    });

    // Calculate price ranges
    const prices = servicePrices.map((s) => s.minSpend).filter((p) => p > 0);
    const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
    const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;

    // Get rating ranges
    const ratings = await prisma.profile.findMany({
      where: {
        averageRating: {
          not: null,
        },
      },
      select: {
        averageRating: true,
      },
      orderBy: {
        averageRating: "asc",
      },
    });

    const ratingValues = ratings
      .map((p) => p.averageRating)
      .filter((r) => r > 0);
    const minRating = ratingValues.length > 0 ? Math.min(...ratingValues) : 0;
    const maxRating = ratingValues.length > 0 ? Math.max(...ratingValues) : 5;

    // Format the response with only the requested filters
    const filters = {
      // Categories with id, title and subcategories array
      categories: categories.map((category) => ({
        id: category.id,
        title: category.title,
        image: category.image,
        subcategories: category.subcategories.map((subcategory) => ({
          id: subcategory.id,
          title: subcategory.title,
          image: subcategory.image,
        })),
      })),

      // Location with lat and lng
      location: {
        lat: 0, // Default value, will be set by frontend
        lng: 0, // Default value, will be set by frontend
      },

      // Pricing with min and max
      pricing: {
        min: minPrice,
        max: maxPrice,
      },

      // Rating with min and max
      rating: {
        min: minRating,
        max: maxRating,
      },
    };

    res.status(200).json({
      message: "Available filters retrieved successfully",
      filters,
    });
  } catch (error) {
    console.error("Error fetching available filters:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
