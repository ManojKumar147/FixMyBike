const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    shop_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
