import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import path from "path";
import {
  uploadFileToS3,
  generateUniqueFileName,
} from "../services/S3Service.js";

const prisma = new PrismaClient();

// Helper function to convert MIME type to enum
const getFileTypeEnum = (mimeType) => {
  const mimeToEnum = {
    "image/jpeg": "JPG",
    "image/jpg": "JPG",
    "image/png": "PNG",
  };
  return mimeToEnum[mimeType] || null;
};

// Upload media file and store in DB
export const uploadMedia = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.body;
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const fileType = getFileTypeEnum(req.file.mimetype);
    if (!fileType) {
      return res.status(400).json({
        message: `Invalid file type: ${req.file.mimetype}. Only PNG, JPG, and JPEG images are allowed.`,
      });
    }

    // Generate a unique filename
    const uniqueFileName = generateUniqueFileName(req.file.originalname);

    // Upload file to S3
    const s3FileUrl = await uploadFileToS3(
      req.file.buffer,
      uniqueFileName,
      req.file.mimetype
    );

    let mediaData = {
      filePath: s3FileUrl, // Store the full S3 URL
      fileType,
    };

    // Associate media with Profile or Service
    if (resourceType === "PROFILE") {
      mediaData.profileId = resourceId;
    } else if (resourceType === "SERVICE") {
      mediaData.serviceId = resourceId;
    } else {
      return res.status(400).json({ message: "Invalid resource type" });
    }

    const media = await prisma.media.create({ data: mediaData });

    res.status(201).json({ message: "Media uploaded successfully", media });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get media file details
export const getMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) return res.status(404).json({ message: "Media not found" });

    res.status(200).json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Server error" });
  }
};
