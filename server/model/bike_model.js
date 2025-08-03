const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bikeSchema = new Schema({
  bike_model: {
    type: String,
    required: true,
  },

  bike_name: {
    type: String,
    required: true,
  },

  bike_company_name: {
    type: String,
    required: true,
  },

  bike_registration_number: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isSelected:{
    type: Boolean,
    default: false,
  }
});

const Bike = mongoose.model("Bike", bikeSchema);
module.exports = Bike;
