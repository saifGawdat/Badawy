const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Check if Cloudinary is fully configured
const isCloudinaryConfigured = 
  process.env.CLOUD_NAME && 
  process.env.API_KEY && 
  process.env.API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  console.log("☁️  Cloudinary Configuration Verified");
} else {
  console.log("📂 Local Storage Enabled (Missing Cloudinary Credentials)");
}

/**
 * Creates a configured multer instance with hybrid storage support.
 * @param {string} folderName - The folder name for Cloudinary or Local Storage subfolder.
 * @param {string[]} allowedFormats - Array of allowed file extensions.
 * @returns {multer.Multer}
 */
const createUpload = (folderName = "badawy_general", allowedFormats = ["jpg", "png", "jpeg", "webp"]) => {
  let storage;

  if (isCloudinaryConfigured) {
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folderName,
        allowed_formats: allowedFormats,
      },
    });
  } else {
    storage = multer.diskStorage({
      destination: (req, file, cb) => {
        // Ensure destination is relative to the backend root or absolute
        const uploadPath = path.join(__dirname, "..", "uploads", folderName);
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });
  }

  return multer({ storage: storage });
};

/**
 * Normalizes the image URL/Path from req.file for database storage.
 * @param {Express.Multer.File} file 
 * @param {string} folderName 
 * @returns {string|null}
 */
const getImageUrl = (file, folderName = "general") => {
  if (!file) return null;
  // Cloudinary returns the full URL in 'path'
  if (isCloudinaryConfigured) return file.path;
  // Local storage returns a path we need to convert to a public URL
  // Assumes express.static is serving 'uploads/' at '/uploads'
  return `/uploads/${folderName}/${file.filename}`;
};

module.exports = {
  cloudinary,
  createUpload,
  getImageUrl,
  isCloudinaryConfigured
};
