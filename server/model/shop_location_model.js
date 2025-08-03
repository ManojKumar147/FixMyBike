const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  latitude: { type: Number },   // Use Number instead of String
  longitude: { type: Number },  // Same here
});

module.exports = mongoose.model('Shop', ShopSchema);
