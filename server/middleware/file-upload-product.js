const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const HttpError = require("../model/http_error");
require("dotenv").config();

// Configure multer with empty diskStorage (temporary in-memory handling)
const storage = multer.diskStorage({});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new HttpError("Only image files are allowed", 422), false);
  }
};

// Set up multer for single product image upload (form field name = "product_image")
const uploadProductImage = multer({
  storage,
  fileFilter,
}).single("product_image");

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload the file to Cloudinary inside a specific folder
const cloudinaryProductImageUpload = async (file, oldImageUrl = null) => {
    if (!file) {
      throw new HttpError("No image file provided", 400);
    }
  
    try {
      // If there's an existing image and it's hosted on Cloudinary, delete it first
      if (oldImageUrl && oldImageUrl.startsWith("https://res.cloudinary.com/")) {
        const publicId = oldImageUrl.split("/").pop().split(".")[0]; // Extract public ID from URL
        console.log("publicId here", publicId);
        await cloudinary.uploader.destroy(publicId); // Delete old image from Cloudinary
      }
  
      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "fix_my_bike/uploads/product_images", // Cloudinary virtual folder
      });
  
      return result.secure_url; // Return the Cloudinary URL of the uploaded image
    } catch (error) {
      console.error("Error uploading product image to Cloudinary:", error);
      throw new HttpError("Image upload failed", 500);
    }
  };
  

// const updateProductImage = async (req, res, next) => {
//     console.log("update product controller called");
//     try {
//       const { product_name, product_price, product_company_name, product_description } = req.body;
//       const productId = req.params.id;
  
//       // Fetch the product from the database
//       const product = await Product.findById(productId);
//       if (!product) {
//         return next(new HttpError("Product not found.", 404));
//       }
  
//       // Check if the user is the shop owner
//       if (!product.shop_owner.equals(new mongoose.Types.ObjectId(req.userId))) {
//         return next(new HttpError("You do not have permission to update this product.", 403));
//       }
  
//       // Update product details (excluding image for now)
//       product.product_name = product_name || product.product_name;
//       product.product_price = product_price || product.product_price;
//       product.product_company_name = product_company_name || product.product_company_name;
//       product.product_description = product_description || product.product_description;
  
//       let productImageUrl = product.img; // Default to existing image URL
  
//       // Check if a new image is uploaded
//       if (req.file) {
//         // Upload the new image and delete the old one
//         productImageUrl = await cloudinaryProductImageUpload(req.file, product.img);
//       }
  
//       // If image URL was updated, save the new image URL to the product
//       if (productImageUrl !== product.img) {
//         product.img = productImageUrl;
//       }
  
//       // Save the updated product to the database
//       await product.save();
  
//       // Return success response
//       res.status(200).json({ message: "Product updated successfully", product });
//     } catch (err) {
//       console.error("Error updating product:", err);
//       return next(new HttpError("Error updating product!", 500));
//     }
//   };

  const deleteImageFromCloudinary = async (imageUrl) => {
    try {
      if (imageUrl && imageUrl.startsWith("https://res.cloudinary.com/")) {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        const fullPublicId = `fix_my_bike/uploads/product_images/${publicId}`; // Adjust if your folder structure changes
  
        await cloudinary.uploader.destroy(fullPublicId);
        console.log("Deleted image from Cloudinary:", fullPublicId);
      }
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
      throw new Error("Failed to delete image from Cloudinary");
    }
  };
  

module.exports = {
  uploadProductImage,
  cloudinaryProductImageUpload,
  deleteImageFromCloudinary,
};
