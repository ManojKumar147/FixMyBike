
const Review = require('../model/review_model');

const createReview = async (req, res) => {
  console.log('req.body', req.body);
    const { itemId, itemType, rating, comment } = req.body;
    const userId = req.userId; 
    console.log('userId', userId);
    try {
      const newReview = await Review.create({
        itemId,
        itemType,
        userId,
        rating,
        comment,
      });
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// Get all reviews for a specific product
const getReviewsByItem = async (req, res) => {
    const { itemId, itemType } = req.params;
  
    try {
      const reviews = await Review.find({ itemId, itemType }).populate('userId', 'name');
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
const getReviews = async (req, res) => {
    try {
      const userId = req.userId;
      const reviews = await Review.find({ userId: userId });
      console.log('reviews', reviews);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    createReview,
    getReviewsByItem,
    getReviews
};
