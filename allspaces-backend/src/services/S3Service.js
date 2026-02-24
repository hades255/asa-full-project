import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// Initialize S3 client with timeout configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
  },
  requestHandler: {
    // Add timeout configuration
    httpOptions: {
      timeout: 25000, // 25 seconds timeout
      connectTimeout: 10000, // 10 seconds connection timeout
    },
  },
});

// Bucket name from environment variables
const bucketName = process.env.AWS_S3_BUCKET_NAME;

/**
 * Upload a file to AWS S3
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - The name to give the file in S3
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<string>} - URL of the uploaded file
 */
export const uploadFileToS3 = async (fileBuffer, fileName, contentType) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    // ACL: "public-read", // Makes the file publicly accessible
  };

  try {
    console.log(`Starting S3 upload for file: ${fileName}`);
    await s3Client.send(new PutObjectCommand(params));
    console.log(`Successfully uploaded file to S3: ${fileName}`);
    // Return the URL to the uploaded file
    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${bucketName}/${fileName}`;

    // return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

/**
 * Delete a file from AWS S3
 * @param {string} fileUrl - The full URL of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFileFromS3 = async (fileUrl) => {
  // Extract the key (filename) from the URL
  const urlParts = fileUrl.split("/");
  const key = urlParts[urlParts.length - 1];

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`Successfully deleted file from S3: ${key}`);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

/**
 * Generate a unique filename with timestamp
 * @param {string} originalName - Original filename
 * @returns {string} - Unique filename
 */
export const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  return `${timestamp}-${Math.random()
    .toString(36)
    .substring(2, 15)}.${extension}`;
};
