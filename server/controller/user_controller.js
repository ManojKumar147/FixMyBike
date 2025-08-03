const User = require("../model/user_model");
const Rating = require("../model/rating_model");
const Bike = require("../model/bike_model");
const HttpError = require("../model/http_error");
const userProfileImageUpload = require("../middleware/upload_user_profile_image");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v2: cloudinary } = require("cloudinary");
const Shop = require("../model/shop_location_model");

const signup = async (req, res, next) => {
  try {
    const { full_name, email, password, phone_number, address, role, fcm_token } =
      req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError("User With This Email Already Exists!", 409));
    }

    let userProfileImageUrl = null;
    if (req.file) {
      userProfileImageUrl =
        await userProfileImageUpload.cloudinaryUserProfileImageUpload(req.file);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      full_name,
      email,
      password: hashedPassword,
      phone_number,
      address,
      role,
      profile_image: userProfileImageUrl,
      
    });
    console.log(user);
    await user.save();
    console.log("User created successfully:", user);

    res.status(201).json({ message: "User Created Successfully!" });
  } catch (err) {
    console.error("Error during signup process:", err);
    return next(new HttpError("Error Creating User!", 500));
  }
};

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     let user = await User.findOne({ email });
//     if (!user) {
//       return next(new HttpError("User Not Found!", 404));
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return next(new HttpError("Invalid Password!", 401));
//     }

//     const payload = {
//       userType: user.role,
//       user: {
//         id: user.id,
//         email: user.email,
//       },
//     };

//     jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
//       if (err) {
//         return next(new HttpError("Error Generating Token!", 500));
//       }
//       console.log('jwt token',token);
//       res.json({ message: "Login Successfully", token });
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     return next(new HttpError("Error Logging In!", 500));
//   }
// };

//for admin

const blockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: true },
      { new: true }
    );
    if (!user) return next(new HttpError("User not found.", 404));
    res.json({ message: "User blocked successfully." });
  } catch (err) {
    return next(new HttpError("Error blocking user!", 500));
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: false },
      { new: true }
    );
    if (!user) return next(new HttpError("User not found.", 404));
    res.json({ message: "User unblocked successfully." });
  } catch (err) {
    return next(new HttpError("Error unblocking user!", 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, fcm_token } = req.body;
console.log('login fcm ',fcm_token);
    let user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError("User Not Found!", 404));
    }
if (user.blocked) {
      return next(new HttpError("Your account is blocked. Please contact support.", 403));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError("Invalid Password!", 401));
    }

    // Update FCM token if provided and different
    if (fcm_token && user.fcm_token !== fcm_token) {
      user.fcm_token = fcm_token;
      await user.save();
    }

    const payload = {
      userType: user.role,
      user: {
        id: user.id,
        email: user.email,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        return next(new HttpError("Error Generating Token!", 500));
      }
      console.log('jwt token',token);
      res.json({ message: "Login Successfully", token });
    });
  } catch (err) {
    console.error("Error:", err);
    return next(new HttpError("Error Logging In!", 500));
  }
};
const updateFcmToken = async (req, res, next) => {
  console.log('updating fcm');
  try {
    const userId = req.userId; // from auth middleware
    const { fcm_token } = req.body;
    if (!fcm_token) return res.status(400).json({ message: 'FCM token required' });
    await User.findByIdAndUpdate(userId, { fcm_token });
    res.json({ message: 'FCM token updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating FCM token', error: error.message });
  }
};

const getUsersToAdmin = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "shop_owner", // Update if your field is different
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "shops",
          localField: "_id",
          foreignField: "user", // Update this field as per your Shop schema
          as: "shop",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$ratings" }, 0] },
              { $avg: "$ratings.rating" },
              0, // Default if no ratings
            ],
          },
          shopLocation: {
            $cond: [
              { $gt: [{ $size: "$shop" }, 0] },
              { $ifNull: [{ $arrayElemAt: ["$shop.location", 0] }, null] },
              null, // Default if no shop
            ],
          },
        },
      },
      {
        $project: {
          full_name: 1,
          email: 1,
          role: 1,
          profile_image: 1,
          averageRating: 1,
          shopLocation: 1,
          blocked: 1,
        },
      },
    ]);

    if (!users.length) {
      return next(new HttpError("No users found.", 404));
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users with rating and shop:", error);
    return next(new HttpError("Failed to fetch users.", 500));
  }
};

//end for admin


const getUsers = async (req, res, next) => {
  try {
    const { userId, userType } = req;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return next(new HttpError("User Not Found!", 404));
    }
    const userRatings = await Rating.find({ shop_owner: userId }).select("rating");
    let ratingInfo = "No rating yet"
    if (userRatings.length) {
       ratingInfo = userRatings;
    }
    console.log(ratingInfo);
    const users = await User.find({
      role: userType === "customer" ? "customer" :"mechanic",
    }).select("full_name email phone_number role");

    res.json({ User: { ...user.toObject(), rating: ratingInfo, users } });
  } catch (err) {
    return next(new HttpError("Error Getting Users!", 500));
  }
};

//
const getMechanics = async (req, res, next) => {
  try {
    const mechanics = await User.find({ role: "mechanic" }).select(
      "full_name email phone_number role address"
    );

    if (!mechanics.length) {
      return next(new HttpError("No mechanics found!", 404));
    }

    // Send the response with the mechanics' data
    res.status(200).json({ mechanics: mechanics });
  } catch (err) {
    return next(new HttpError("Error Getting Mechanics!", 500));
  }
};

const getMechanicsWithLocation = async (req, res, next) => {
  try {
    // Find all mechanics
    const mechanics = await User.find({ role: "mechanic" })
      .select("full_name email phone_number role address");

    if (!mechanics.length) {
      return next(new HttpError("No mechanics found!", 404));
    }

    // Default coordinates in case no shop is found or coordinates are missing
    const defaultLatitude = 0.0;  // Default latitude
    const defaultLongitude = 0.0; // Default longitude

    // For each mechanic, find the corresponding shop by matching the 'owner' field
    const mechanicsWithLocation = await Promise.all(mechanics.map(async (mechanic) => {
      // Find shop for each mechanic using the owner reference
      const shop = await Shop.findOne({ owner: mechanic._id }).select('latitude longitude');

      // Return the mechanic with the shop's latitude and longitude, or default if missing
      return {
        full_name: mechanic.full_name,
        email: mechanic.email,
        phone_number: mechanic.phone_number,
        role: mechanic.role,
        address: mechanic.address,
        latitude: shop && shop.latitude ? shop.latitude : defaultLatitude,  // Default latitude if missing
        longitude: shop && shop.longitude ? shop.longitude : defaultLongitude,  // Default longitude if missing
      };
    }));

    // Send the response with the mechanics' data along with their shop coordinates
    res.status(200).json({
      mechanics: mechanicsWithLocation,
    });

  } catch (err) {
    console.error(err);
    return next(new HttpError("Error getting mechanics!", 500));
  }
};



const getSellers = async (req, res, next) => {
  try {
    const sellers = await User.find({ role: "seller" }).select(
      "full_name email phone_number role address"
    );
    if (!sellers.length) {
      return next(new HttpError("No sellers found!", 404));
    }

    // Send the response with the sellers' data
    res.status(200).json({ Sellers: sellers });
  } catch (err) {
    return next(new HttpError("Error Getting Sellers!", 500));
  }
};

const getSellersWithRatings = async (req, res, next) => {
  try {
    const sellers = await User.aggregate([
      { $match: { role: "seller" } }, // Get only sellers
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "shop_owner",
          as: "ratings",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$ratings" }, 0] }, // If ratings exist
              then: { $avg: "$ratings.rating" }, // Calculate average
              else: 0, // Default 0 if no ratings
            },
          },
        },
      },
      {
        $project: {
          full_name: 1,
          email: 1,
          phone_number: 1,
          role: 1,
          address: 1,
          profile_image: 1, // Include profile image (if needed)
          averageRating: 1,
        },
      },
    ]);

    if (!sellers.length) {
      return next(new HttpError("No sellers found!", 404));
    }

    res.status(200).json({ sellers });
  } catch (err) {
    console.error("Error fetching sellers with ratings:", err);
    return next(new HttpError("Error fetching sellers!", 500));
  }
};

const getMechanicsWithRatings = async (req, res, next) => {
  try {
    const sellers = await User.aggregate([
      { $match: { role: "mechanic" } }, // Get only sellers
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "shop_owner",
          as: "ratings",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$ratings" }, 0] }, // If ratings exist
              then: { $avg: "$ratings.rating" }, // Calculate average
              else: 0, // Default 0 if no ratings
            },
          },
        },
      },
      {
        $project: {
          full_name: 1,
          email: 1,
          phone_number: 1,
          role: 1,
          address: 1,
          profile_image: 1, // Include profile image (if needed)
          averageRating: 1,
        },
      },
    ]);

    if (!sellers.length) {
      return next(new HttpError("No mechanic found!", 404));
    }

    res.status(200).json({ sellers });
  } catch (err) {
    console.error("Error fetching mechanic with ratings:", err);
    return next(new HttpError("Error fetching mechanic!", 500));
  }
};


//

const getUsersById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(new HttpError("User Not Found For Provided Id!", 404));
    }
    res.json({ User: user });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return next(new HttpError("User Not Found For Provided Id!", 404));
    }
    return next(new HttpError("Server Error", 500));
  }
};

const updateUsers = async (req, res, next) => {
  console.log("Updating user with ID:", req.params.id);
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "Invalid User Id" });
  }

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      if (req.body.full_name) user.full_name = req.body.full_name;
      if (req.body.address) user.address = req.body.address;
      if (req.file) {
        if (user.profile_image) {
          const publicId = user.profile_image
            .split("/")
            .slice(-4)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        const folderPath = "fix_my_bike/uploads/user_profile_images";

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: folderPath,
          unique_filename: false,
        });

        user.profile_image = result.secure_url;
      }
    }

    await user.save();

    res.status(200).json({ message: "User Updated Successfully.", user });
  } catch (err) {
    console.log("Error updating User:", err);
    return next(new HttpError("Failed To Update User!", 500));
  }
};

const deleteUsers = async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return next(new HttpError("Invalid User ID", 400));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    if (user.profile_image) {
      try {
        const publicId = user.profile_image
          .split("/")
          .slice(-4)
          .join("/")
          .split(".")[0];

        const deletionResult = await cloudinary.uploader.destroy(publicId);
        if (deletionResult.result !== "ok") {
          console.error(
            `Failed to delete Client Profile Image from Cloudinary: ${publicId}`
          );
        }
      } catch (err) {
        console.error(
          "Error deleting Client Profile image from Cloudinary:",
          err
        );
      }
    }

    await User.deleteOne({ _id: userId });

    await Bike.deleteMany({ _id: userId });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Internal server error.", 500));
  }
};

const logout = async (req, res, next) => {
  try {
    res.json({ message: "Logout Successful", token: null });
  } catch (err) {
    console.error("Error Logging Out:", err);
    return next(new HttpError("Error Logging Out!", 500));
  }
};

const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError("User Not Found!", 404));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password Reset Successfully!" });
  } catch (err) {
    console.log("Error:", err);
    return next(new HttpError("Error Resetting Password!", 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(`Received request to reset password for email: ${email}`);

  try {
    const existingUser = await User.findOne({ email });
    console.log(`Looking for user in database with email: ${email}`);

    if (!existingUser) {
      console.error("User does not exist!");
      return next(new HttpError("User does not exist!", 404));
    }
    console.log(`User found: ${existingUser.email}`);

    const secret = process.env.JWT_SECRET + existingUser.password;
    console.log(`Generated secret for token: ${secret}`);

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      {
        expiresIn: "5m",
      }
    );
    console.log("Generated password reset token:", token);

    // Construct the reset password URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${existingUser._id}/${token}`;
    console.log("Password reset URL:", resetUrl);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, 
      port: process.env.EMAIL_PORT, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
      secure: true, 
    });

    await transporter.verify((error) => {
      if (error) {
        console.error("Error verifying transporter:", error);
        return next(new HttpError("Transporter verification failed", 500));
      } else {
        console.log("Mailer transporter is ready to send emails.");
      }
    });

    const mailOptions = {
      from: "fixmybike@gmail.com",
      to: existingUser.email,
      subject: "Password Reset Request",
      text: `Please click the following link to reset your password: ${resetUrl}. This link is valid for 5 minutes.`,
      html: `<p>Please click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link is valid for 5 minutes.</p>`,
    };
    console.log(`Sending email to: ${existingUser.email}`);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return next(new HttpError("Failed to send reset token email", 500));
      } else {
        console.log("Email sent successfully: " + info.response);
        return res
          .status(200)
          .json({ message: "Password reset link sent to your email." });
      }
    });

    console.log("Password reset link (sent):", resetUrl);
  } catch (error) {
    console.error("Error:", error);
    return next(new HttpError("Error Processing Password Reset!", 500));
  }
};

module.exports = {
  signup,
  login,
  getMechanics,
  getUsers,
  getUsersById,
  updateUsers,
  deleteUsers,
  logout,
  resetPassword,
  forgotPassword,
  getSellers,
  getSellersWithRatings,
  getMechanicsWithRatings,
  getMechanicsWithLocation,
  getUsersToAdmin,
  updateFcmToken,
  blockUser,
  unblockUser,
};
