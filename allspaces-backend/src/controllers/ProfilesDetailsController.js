import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import {
  uploadFileToS3,
  generateUniqueFileName,
} from "../services/S3Service.js";

const prisma = new PrismaClient();

// Add Facility to Profile
export const addFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const facility = await prisma.facility.create({
      data: { name, profileId: id },
    });

    const profile = await prisma.profile.findUnique({
      where: { id },
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

    res.status(200).json({ message: "Facility added", profile });
  } catch (error) {
    console.error("Error adding facility:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Facility
export const updateFacility = async (req, res) => {
  try {
    const { profileId, facilityId } = req.params;
    const { name } = req.body;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        message: "Facility name is required",
      });
    }

    // Check if profile exists and belongs to the authenticated user
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.user.id !== req.user.id) {
      return res.status(403).json({
        message:
          "Forbidden: You can only update facilities for your own profiles",
      });
    }

    // Check if facility exists and belongs to the profile
    const facility = await prisma.facility.findFirst({
      where: {
        id: facilityId,
        profileId: profileId,
      },
    });

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    // Update the facility
    const updatedFacility = await prisma.facility.update({
      where: { id: facilityId },
      data: { name },
    });

    // Get the updated profile with all relations
    const updatedProfile = await prisma.profile.findUnique({
      where: { id: profileId },
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

    res.status(200).json({
      success: true,
      message: "Facility updated successfully",
      facility: updatedFacility,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating facility:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Facility
export const deleteFacility = async (req, res) => {
  try {
    const { profileId, facilityId } = req.params;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Check if profile exists and belongs to the authenticated user
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.user.id !== req.user.id) {
      return res.status(403).json({
        message:
          "Forbidden: You can only delete facilities for your own profiles",
      });
    }

    // Check if facility exists and belongs to the profile
    const facility = await prisma.facility.findFirst({
      where: {
        id: facilityId,
        profileId: profileId,
      },
    });

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    // Delete the facility
    await prisma.facility.delete({
      where: { id: facilityId },
    });

    // Get the updated profile with all relations
    const updatedProfile = await prisma.profile.findUnique({
      where: { id: profileId },
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

    res.status(200).json({
      success: true,
      message: "Facility deleted successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error deleting facility:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add Medias to Profile with S3 Upload
export const addMedia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Profile ID is required" });

    const profile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!profile)
      return res.status(400).json({ message: "Profile does not exist" });

    if (!req.files || req.files.length <= 0)
      return res.status(400).json({ message: "Files are required" });

    // Handle Media Upload to S3
    let mediaRecords = [];
    console.log("Files detected => ", req.files.length);

    if (req.files && req.files.length > 0) {
      console.log("Files check passed => ", req.files.length);

      // Process files sequentially to avoid timeout issues
      for (const file of req.files) {
        try {
          const fileType = getFileTypeEnum(file.mimetype); // Convert MIME to enum
          if (!fileType) {
            return res.status(400).json({
              message: `Invalid file type: ${file.mimetype}. Only PNG, JPG, and JPEG images are allowed.`,
            });
          }

          console.log("Processing file => ", file.originalname);

          // Generate a unique filename
          const uniqueFileName = generateUniqueFileName(file.originalname);

          // Upload file to S3 with timeout handling
          const s3FileUrl = await Promise.race([
            uploadFileToS3(file.buffer, uniqueFileName, file.mimetype),
            new Promise(
              (_, reject) =>
                setTimeout(() => reject(new Error("S3 upload timeout")), 30000) // 30 second timeout
            ),
          ]);

          // Create media record in database
          const mediaRecord = await prisma.media.create({
            data: {
              filePath: s3FileUrl, // Store the full S3 URL
              fileType, // Store enum value
              profileId: profile.id,
            },
          });

          mediaRecords.push(mediaRecord);
          console.log("Successfully processed file => ", file.originalname);
        } catch (error) {
          console.error("Error processing file:", file.originalname, error);

          // If S3 upload failed, try to clean up any partial uploads
          if (error.message.includes("S3 upload timeout")) {
            return res.status(408).json({
              message:
                "Upload timeout. Please try again with smaller files or check your connection.",
              error: error.message,
            });
          }

          return res.status(500).json({
            message: `Failed to process file: ${file.originalname}`,
            error: error.message,
          });
        }
      }
    }

    res.status(200).json({
      message: "Media files uploaded to S3 successfully",
      media: mediaRecords,
      count: mediaRecords.length,
    });
  } catch (error) {
    console.error("Error adding media:", error);
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

// Update Media
export const updateMedia = async (req, res) => {
  try {
    const { profileId, mediaId } = req.params;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Check if profile exists and belongs to the authenticated user
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.user.id !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden: You can only update media for your own profiles",
      });
    }

    // Check if media exists and belongs to the profile
    const media = await prisma.media.findFirst({
      where: {
        id: mediaId,
        profileId: profileId,
      },
    });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Handle new file upload if provided
    if (req.file) {
      try {
        const fileType = getFileTypeEnum(req.file.mimetype);
        if (!fileType) {
          return res.status(400).json({
            message: `Invalid file type: ${req.file.mimetype}. Only PNG, JPG, and JPEG images are allowed.`,
          });
        }

        // Generate a unique filename
        const uniqueFileName = generateUniqueFileName(req.file.originalname);

        // Upload file to S3 with timeout handling
        const s3FileUrl = await Promise.race([
          uploadFileToS3(req.file.buffer, uniqueFileName, req.file.mimetype),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("S3 upload timeout")), 30000)
          ),
        ]);

        // Update media record with new file
        const updatedMedia = await prisma.media.update({
          where: { id: mediaId },
          data: {
            filePath: s3FileUrl,
            fileType,
          },
        });

        // Get the updated profile with all relations
        const updatedProfile = await prisma.profile.findUnique({
          where: { id: profileId },
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

        return res.status(200).json({
          success: true,
          message: "Media updated successfully",
          media: updatedMedia,
          profile: updatedProfile,
        });
      } catch (error) {
        console.error("Error uploading file:", error);

        if (error.message.includes("S3 upload timeout")) {
          return res.status(408).json({
            message:
              "Upload timeout. Please try again with smaller files or check your connection.",
            error: error.message,
          });
        }

        return res.status(500).json({
          message: "Failed to upload file",
          error: error.message,
        });
      }
    } else {
      return res.status(400).json({
        message: "No file provided for update",
      });
    }
  } catch (error) {
    console.error("Error updating media:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Media
export const deleteMedia = async (req, res) => {
  try {
    const { profileId, mediaId } = req.params;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required. User not found in request.",
      });
    }

    // Check if profile exists and belongs to the authenticated user
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.user.id !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden: You can only delete media for your own profiles",
      });
    }

    // Check if media exists and belongs to the profile
    const media = await prisma.media.findFirst({
      where: {
        id: mediaId,
        profileId: profileId,
      },
    });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Delete the media
    await prisma.media.delete({
      where: { id: mediaId },
    });

    // Get the updated profile with all relations
    const updatedProfile = await prisma.profile.findUnique({
      where: { id: profileId },
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

    res.status(200).json({
      success: true,
      message: "Media deleted successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
