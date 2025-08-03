const express = require('express');
const router = express.Router();
const { createReview, getReviewsByItem, getReviews } = require('../controller/review_controller');
const authMiddleware = require('../middleware/authMiddleware/authMiddleware');

router.post('/reviews/create-review', authMiddleware, createReview);
router.get('/reviews/get-review-by-id/:itemType/:itemId', authMiddleware, getReviewsByItem); 
router.get('/reviews/get-all-reviews', authMiddleware, getReviews);
module.exports = router;
