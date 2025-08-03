const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profile_image: {
    type: String,
  },

  full_name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    ],
    minlength: 8,
  },

  phone_number: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["customer", "mechanic","seller","admin"],
    default: "customer",
  },

blocked: {
    type: Boolean,
    default: false,
  },
  
  bikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
    },
  ],
  fcm_token: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
