const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  service_name: {
    type: String,
    required: true,
    trim: true,
  },

  service_description: {
    type: String,
    required: true,
  },

  service_price: {
    type: Number,
    required: true,
    min: 0,
  },

  service_model: {
    type: String,
    required: true,
  },

  engine_power: {
    type: Number,
    required: true,
    min: 50, // Assuming minimum engine power is 50cc
  },
  
  shop_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Img: {
    type: String,
    required: false,  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
