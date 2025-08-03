const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const HttpError = require("../model/http_error");
require("dotenv").config();

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new HttpError("Only images are allowed", 422), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("profile_image");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUserProfileImageUpload = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `fix_my_bike/uploads/user_profile_images`,
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error uploading user image to Cloudinary:", error);
    throw new HttpError("Error uploading user image to Cloudinary", 500);
  }
};

module.exports = {
  upload,
  cloudinaryUserProfileImageUpload,
};
