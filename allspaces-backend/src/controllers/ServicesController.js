import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import path from "path";
import fs from "fs";
import {
  uploadFileToS3,
  deleteFileFromS3,
  generateUniqueFileName,
} from "../services/S3Service.js";

const prisma = new PrismaClient();

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        media: true,
        category: true,
        profile: true,
      },
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        media: true,
        category: {
          include: {
            parent: true,
          },
        },
        profile: true,
      },
    });

    if (!service) return res.status(404).json({ message: "Service not found" });

    // Format service data similar to getMyProfile
    const formattedService = {
      id: service.id || "",
      name: service.name || "",
      description: service.description || "",
      subCategoryId: service.category?.id || null,
      categoryId: service.category?.parent?.id || null,
      media: service.media ? service.media.filePath || "" : null,
      minSpend: service.minSpend || 0,
      profileId: service.profileId || null,
    };

    res.status(200).json(formattedService);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create service with S3 upload
export const createService = async (req, res) => {
  try {
    const { name, description, categoryId, minSpend } = req.body;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Validate all required fields
    if (!name || !description || !categoryId || !minSpend) {
      return res.status(400).json({
        message:
          "All fields are required: name, description, categoryId, minSpend, media",
      });
    }

    // Validate media is provided
    if (!req.file) {
      return res.status(400).json({
        message: "media is required. Please upload an image file.",
      });
    }

    // Validate minSpend is a valid number
    if (isNaN(parseFloat(minSpend)) || parseFloat(minSpend) < 0) {
      return res.status(400).json({
        message: "minSpend must be a valid positive number",
      });
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Get the authenticated user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(400).json({
        message:
          "Profile not found. Please create a profile first before adding services.",
      });
    }

    // Create service with the authenticated user's profile
    const service = await prisma.service.create({
      data: {
        name,
        description,
        categoryId,
        profileId: profile.id,
        minSpend: parseFloat(minSpend),
      },
    });

    // Handle Media Upload to S3
    let mediaRecord = null;
    if (req.file) {
      console.log("File detected => ", req.file);
      const fileType = getFileTypeEnum(req.file.mimetype);

      if (!fileType) {
        return res.status(400).json({
          message: `Invalid file type: ${req.file.mimetype}. Only PNG, JPG, and JPEG images are allowed.`,
        });
      }

      try {
        // Generate a unique filename
        const uniqueFileName = generateUniqueFileName(req.file.originalname);

        // Upload file to S3
        const s3FileUrl = await uploadFileToS3(
          req.file.buffer,
          uniqueFileName,
          req.file.mimetype
        );

        // Create media record in database
        mediaRecord = await prisma.media.create({
          data: {
            filePath: s3FileUrl, // Store the full S3 URL
            fileType,
            serviceId: service.id,
          },
        });

        console.log("File uploaded to S3, URL => ", s3FileUrl);
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        return res.status(500).json({
          message: "Error uploading file to S3",
          error: error.message,
        });
      }
    }

    res.status(201).json({
      message: "Service created successfully",
      service: service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update service with S3 support
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, minSpend } = req.body;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Validate required fields
    if (!name || !description || !categoryId || !minSpend) {
      return res.status(400).json({
        message:
          "All fields are required: name, description, categoryId, minSpend",
      });
    }

    // Validate minSpend is a valid number
    if (isNaN(parseFloat(minSpend)) || parseFloat(minSpend) < 0) {
      return res.status(400).json({
        message: "minSpend must be a valid positive number",
      });
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id },
      include: { media: true, category: true },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Get the authenticated user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(400).json({
        message:
          "Profile not found. Please create a profile first before updating services.",
      });
    }

    // Handle Media Upload to S3
    if (req.file) {
      const fileType = getFileTypeEnum(req.file.mimetype);

      if (!fileType) {
        return res
          .status(400)
          .json({ message: `Invalid file type: ${req.file.mimetype}` });
      }

      // If service already has media
      if (service.media) {
        // Delete from S3 if it's an S3 URL
        if (
          service.media.filePath &&
          service.media.filePath.includes("amazonaws.com")
        ) {
          try {
            console.log("Deleting old file from S3");
            await deleteFileFromS3(service.media.filePath);
            console.log("Old file deleted from S3");
          } catch (error) {
            console.warn("Error deleting file from S3:", error);
            // Continue with the update even if deletion fails
          }
        }
        // Handle legacy local file deletion
        else if (
          service.media.filePath &&
          service.media.filePath.startsWith("/uploads/")
        ) {
          console.log("Deleting old local file");

          // Ensure the filePath has no leading slash (if it exists)
          const fileName = service.media.filePath.startsWith("/")
            ? service.media.filePath.substring(1)
            : service.media.filePath;

          // Use the absolute path to the file with process.cwd() to get the project root
          const oldPath = path.join(process.cwd(), fileName);

          if (fs.existsSync(oldPath)) {
            fs.unlink(oldPath, (err) => {
              if (err) {
                console.warn("Error deleting file:", err);
              } else {
                console.log("Old file deleted:", oldPath);
              }
            });
          }
        }

        // Delete the media record
        await prisma.media.delete({ where: { id: service.media.id } });
      }

      try {
        // Generate a unique filename
        const uniqueFileName = generateUniqueFileName(req.file.originalname);

        // Upload file to S3
        const s3FileUrl = await uploadFileToS3(
          req.file.buffer,
          uniqueFileName,
          req.file.mimetype
        );

        // Create new media record
        await prisma.media.create({
          data: {
            filePath: s3FileUrl, // Store the full S3 URL
            fileType,
            serviceId: id,
          },
        });

        console.log("File uploaded to S3, URL => ", s3FileUrl);
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        return res.status(500).json({
          message: "Error uploading file to S3",
          error: error.message,
        });
      }
    }

    // Update service using transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update the service
      const updatedService = await prisma.service.update({
        where: { id },
        data: {
          name,
          description,
          categoryId,
          profileId: profile.id,
          minSpend: parseFloat(minSpend),
        },
      });

      // Return the service with all relations
      return await prisma.service.findUnique({
        where: { id },
        include: {
          media: true,
          category: true,
          profile: true,
        },
      });
    });

    res.status(200).json({
      message: "Service updated successfully",
      service: result,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete service with S3 support
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        media: true,
        profile: {
          select: {
            id: true,
            userId: true,
            name: true,
          },
        },
        category: true,
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if user has permission to delete this service
    // User can only delete services that belong to their profiles
    const hasPermission =
      service.profile && service.profile.userId === req.user.id;

    if (!hasPermission) {
      return res.status(403).json({
        message:
          "Forbidden: You can only delete services that belong to your profiles",
      });
    }

    // Delete media file if it exists
    if (service.media) {
      try {
        // If file is on S3
        if (
          service.media.filePath &&
          service.media.filePath.includes("amazonaws.com")
        ) {
          console.log("Deleting file from S3");
          await deleteFileFromS3(service.media.filePath);
          console.log("File deleted from S3");
        }
        // Handle legacy local file deletion
        else if (
          service.media.filePath &&
          service.media.filePath.startsWith("/uploads/")
        ) {
          // Delete the file from storage
          const fileName = service.media.filePath.startsWith("/")
            ? service.media.filePath.substring(1)
            : service.media.filePath;

          const filePath = path.join(process.cwd(), fileName);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Use sync version for better error handling
            console.log("Local file deleted:", filePath);
          }
        }
      } catch (error) {
        console.warn("Error deleting media file:", error);
        // Continue with service deletion even if file deletion fails
      }
    }

    // Delete the service using transaction for consistency
    await prisma.$transaction(async (prisma) => {
      // Delete the service (will cascade delete media due to relation)
      await prisma.service.delete({
        where: { id },
      });
    });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      deletedService: {
        id: service.id,
        name: service.name,
        description: service.description,
      },
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get services for dropdown selection
export const getServicesForSelection = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        media: {
          select: {
            filePath: true,
            fileType: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services for selection:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get services by category type
export const getServicesByCategoryType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!type) {
      return res.status(400).json({ message: "Category type is required" });
    }

    // Find services whose category has the specified type
    const services = await prisma.service.findMany({
      where: {
        category: {
          type: type,
        },
      },
      include: {
        media: true,
        category: true,
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json(services);
  } catch (error) {
    console.error(
      `Error fetching services by category type '${req.params.type}':`,
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get services by user ID
export const getServicesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get all profiles that belong to this user
    const userProfiles = await prisma.profile.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    // Get profile IDs
    const profileIds = userProfiles.map((profile) => profile.id);

    if (profileIds.length === 0) {
      return res.status(200).json([]);
    }

    // Get services associated with these profiles
    const services = await prisma.service.findMany({
      where: {
        profileId: {
          in: profileIds,
        },
      },
      include: {
        media: true,
        category: true,
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Format services to maintain API compatibility
    const formattedServices = services.map((service) => ({
      ...service,
      profiles: [
        {
          id: service.profile.id,
          name: service.profile.name,
          minSpend: service.minSpend,
        },
      ],
    }));

    res.status(200).json(formattedServices);
  } catch (error) {
    console.error(
      `Error fetching services for user ${req.params.userId}:`,
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
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
