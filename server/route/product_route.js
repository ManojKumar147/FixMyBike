const express = require("express");
const router = express.Router();
const productController = require("../controller/product_controller");
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const { uploadProductImage } = require("../middleware/file-upload-product");


router.post("/add-product", authMiddleware, uploadProductImage, productController.addProduct);

router.get(
  "/get-products",
  authMiddleware,
  productController.getshopProducts
);

router.get(
  "/admin/get-products",
  authMiddleware,
  productController.getProductsToAdmin
);

router.get("/get-products/:userId", authMiddleware, productController.getProductsByUserId);

router.get("/all/products", authMiddleware, productController.getAllProducts);

router.patch("/update-product/:id", authMiddleware, uploadProductImage, productController.updateProduct);

router.delete("/remove-product/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
