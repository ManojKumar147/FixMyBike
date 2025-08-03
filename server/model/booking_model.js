const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceName: { type: String, required: true },

  serviceBasePrice: { type: Number, required: true },

  name: { type: String, required: true },

  cell: { type: String, required: true },

  address: { type: String, required: true },

  comments: { type: String },

  bikeModel: { type: String, required: true },

  bikeName: { type: String, required: true },

  bikeCompanyName: { type: String, required: true },

  bikeRegNumber: { type: String, required: true },

  dropOff: { type: String },

  additionalServices: { type: [String] },

  totalPrice: { type: Number, required: true },

  timestamp: { type: Date, default: Date.now },

  status: { type: String, default: "pending" },

  mechanicName: { type: String, default: null },

  mechanicNumber: {type: String, default: null },

  mechanicId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  scheduleDate: { type: Date, default: null}
});

module.exports = mongoose.model("Booking", bookingSchema);
