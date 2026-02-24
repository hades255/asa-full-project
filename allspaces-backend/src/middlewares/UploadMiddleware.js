import multer from "multer";

// Use memory storage for S3 upload
const storage = multer.memoryStorage(); // Stores files as buffers

// File filter to allow only PNG, JPG, and JPEG files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only PNG, JPG, and JPEG images are allowed.`
      ),
      false
    );
  }
};

// Size limits for uploads
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB max file size
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
