const Rating = require("../model/rating_model");
const User = require("../model/user_model");
const HttpError = require("../model/http_error");
const mongoose = require("mongoose");

const saveRating = async (req, res) => {
    const { shop_owner, rating } = req.body;

    try {
        const existingRating = await Rating.findOne({ shop_owner });

        let updatedRating;

        if (existingRating) {
            const newAverage = (existingRating.rating + rating) / 2;

            updatedRating = await Rating.findOneAndUpdate(
                { shop_owner },
                { rating: newAverage },
                { new: true }
            );
        } else {
            updatedRating = await Rating.create({ shop_owner, rating });
        }

        res.json({ success: true, message: "Rating saved successfully!", rating: updatedRating });
    } catch (error) {
        console.error("Error saving rating:", error);
        res.status(500).json({ success: false, message: "Error saving rating" });
    }
};

// Get average rating
const getAverageRating = async (req, res) => {
    try {
        const result = await Rating.aggregate([
            { $group: { _id: null, averageRating: { $avg: "$rating" } } }
        ]);

        res.json({
            success: true,
            averageRating: result.length ? result[0].averageRating.toFixed(1) : 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching rating' });
    }
};

module.exports = {
  saveRating,
  getAverageRating,
};
