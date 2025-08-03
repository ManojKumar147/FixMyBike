const express = require('express');
const router = express.Router();
const ratingController = require('../controller/rating_controller');

const authMiddleware = require("../middleware/authMiddleware/authMiddleware");

router.post('/save-rating', authMiddleware, ratingController.saveRating);
router.get('/average-rating', authMiddleware, ratingController.getAverageRating);

module.exports = router;
