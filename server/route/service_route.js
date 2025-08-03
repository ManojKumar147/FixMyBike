const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const { createService, getShopServices, getServiceById, updateService, deleteService, getServicesByUserId ,getAllServices} = require("../controller/service_controller");
const { createUploadMiddleware,
     } = require("../middleware/file-upload-services");

    const uploadServiceImage = createUploadMiddleware("service_image");

router.post("/shop/services", authMiddleware, uploadServiceImage, createService);
router.get("/shop/services",authMiddleware, getShopServices); 
router.get("/shop/all/services",authMiddleware, getAllServices); 
router.get("/shop/get-services/:userId",authMiddleware, getServicesByUserId);  
router.get("/shop/services/:id",authMiddleware, getServiceById);
router.put("/shop/services/:id",authMiddleware, uploadServiceImage, updateService);
router.delete("/shop/services/:id",authMiddleware, deleteService);

module.exports = router;
