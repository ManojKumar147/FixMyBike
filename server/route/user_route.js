const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const userController = require("../controller/user_controller");
const profileImageUpload = require("../middleware/upload_user_profile_image");

router.post("/signup", profileImageUpload.upload, userController.signup);

router.post("/signin", userController.login);
router.post('/update-fcm-token', authMiddleware, userController.updateFcmToken);

// ...existing code...
router.put("/block-user/:id", authMiddleware, userController.blockUser);
router.put("/unblock-user/:id", authMiddleware, userController.unblockUser);
// ...existing code...
router.get("/get-users", authMiddleware, userController.getUsers);

router.get("/admin/get-Users", authMiddleware, userController.getUsersToAdmin);

router.get("/get-mechanics", authMiddleware, userController.getMechanics);

router.get("/get-sellers", authMiddleware, userController.getSellers);

router.get("/get-seller's-ratings", authMiddleware, userController.getSellersWithRatings);

router.get("/get-mechanic's-ratings", authMiddleware, userController.getMechanicsWithRatings);

router.get("/get-mechanics-with-location", authMiddleware, userController.getMechanicsWithLocation);

router.get("/get-user-by-id/:id", authMiddleware, userController.getUsersById);

router.put("/reset-password", userController.resetPassword);

router.post("/forgot-password", userController.forgotPassword);

router.post("/logout", authMiddleware, userController.logout);

router.put(
  "/update-user/:id",
  authMiddleware,
  profileImageUpload.upload,
  userController.updateUsers
);

router.delete("/remove-user/:id", authMiddleware, userController.deleteUsers);

module.exports = router;
