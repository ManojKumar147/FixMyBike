const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const HttpError = require("../model/http_error");
require("dotenv").config();

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer with memory storage
const storage = multer.diskStorage({});

// Filter only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new HttpError("Only image files are allowed", 422), false);
  }
};

// ✅ Factory function to create multer middleware for any field name
const createUploadMiddleware = (fieldName) => {
  return multer({ storage, fileFilter }).single(fieldName);
};

// ✅ Reusable Cloudinary upload function
const uploadImageToCloudinary = async (file, folder, oldImageUrl = null) => {
  if (!file) throw new HttpError("No image file provided", 400);

  try {
    if (oldImageUrl && oldImageUrl.startsWith("https://res.cloudinary.com/")) {
      const publicId = oldImageUrl.split("/").pop().split(".")[0];
      const fullPublicId = `${folder}/${publicId}`;
      await cloudinary.uploader.destroy(fullPublicId);
    }

    const result = await cloudinary.uploader.upload(file.path, { folder });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new HttpError("Image upload failed", 500);
  }
};

// ✅ Reusable Cloudinary delete function
const deleteImageFromCloudinary = async (imageUrl, folder) => {
  try {
    if (imageUrl && imageUrl.startsWith("https://res.cloudinary.com/")) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      const fullPublicId = `${folder}/${publicId}`;
      await cloudinary.uploader.destroy(fullPublicId);
      console.log("Deleted from Cloudinary:", fullPublicId);
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};


module.exports = {
  createUploadMiddleware,          // For multer
  uploadImageToCloudinary,         // For upload
  deleteImageFromCloudinary        // For delete
};
