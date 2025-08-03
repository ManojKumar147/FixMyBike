const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },

  product_price: {
    type: Number,
    required: true,
  },

  product_company_name: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
    required: true,
  },

  shop_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  img: {
    type: String,
    required: false,
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
