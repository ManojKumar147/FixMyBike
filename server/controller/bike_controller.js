const Bike = require("../model/bike_model");
const User = require("../model/user_model");
const HttpError = require("../model/http_error");
const mongoose = require("mongoose");

const addBike = async (req, res, next) => {
  try {
    const {
      bike_model,
      bike_name,
      bike_company_name,
      bike_registration_number,
    } = req.body;
    const userId = req.userId;

    const newBike = new Bike({
      bike_model,
      bike_name,
      bike_company_name,
      bike_registration_number,
      user: userId,
    });

    await newBike.save();

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    user.bikes.push(newBike._id);
    await user.save();

    res.status(201).json({ message: "Bike added successfully", bike: newBike });
  } catch (err) {
    console.error("Error adding bike:", err);
    return next(new HttpError("Error adding bike!", 500));
  }
};

const getUserBikes = async (req, res, next) => {
  console.log('backend hit');
  try {
    const userId = req.params.id;

    const bikes = await Bike.find({ user: userId });
    console.log("Fetching bikes for user ID:", bikes);

    if (!bikes.length) {
      return next(new HttpError("No bikes found for this user.", 404));
    }

    res.json({ Bikes: bikes });
  } catch (err) {
    return next(new HttpError("Error fetching bikes!", 500));
  }
};

const updateBike = async (req, res, next) => {
  try {
    const {
      bike_model,
      bike_name,
      bike_company_name,
      bike_registration_number,
    } = req.body;
    const bikeId = req.params.id;

    // Find the bike by its ID
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return next(new HttpError("Bike not found.", 404));
    }

    // Debugging output for user IDs
    console.log("Bike User ID:", bike.user.toString());
    console.log("Current User ID:", req.userId);

    // Check if the current user is the owner of the bike
    if (!bike.user.equals(new mongoose.Types.ObjectId(req.userId))) {
      return next(
        new HttpError("You do not have permission to update this bike.", 403)
      );
    }

    // Update bike properties
    bike.bike_model = bike_model || bike.bike_model;
    bike.bike_name = bike_name || bike.bike_name;
    bike.bike_company_name = bike_company_name || bike.bike_company_name;
    bike.bike_registration_number =
      bike_registration_number || bike.bike_registration_number;

    await bike.save(); // Save the updated bike
    res.status(200).json({ message: "Bike updated successfully", bike });
  } catch (err) {
    console.error("Error updating bike:", err);
    return next(new HttpError("Error updating bike!", 500));
  }
};
//
const selectBike = async (req, res, next) => {
  try {
    const {isSelected } = req.body;
    const bikeId = req.params.id;

    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return next(new HttpError("Bike not found.", 404));
    }

    console.log("Bike User ID:", bike.user.toString());
    console.log("Current User ID:", req.userId);

    if (!bike.user.equals(new mongoose.Types.ObjectId(req.userId))) {
      return next(
        new HttpError("You do not have permission to selection update this bike.", 403)
      );
    }

    await Bike.updateMany(
      { user: req.userId },
      { $set: { isSelected: false } }
    );

    if (isSelected !== undefined) {
      bike.isSelected = isSelected;
    }

    await bike.save(); 
    res.status(200).json({ message: "Bike selection updated successfully", bike });
  } catch (err) {
    console.error("Error selection updating bike:", err);
    return next(new HttpError("Error selection updating bike!", 500));
  }
};

const geSelectedBike = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const bike = await Bike.find({ user: userId,
      isSelected: true,
     });

    if (!bike.length) {
      return next(new HttpError("No bikes found for this user.", 404));
    }
    res.json({ Bike: bike });
  } catch (err) {
    return next(new HttpError("Error fetching bikes!", 500));
  }
};
//

const deleteBike = async (req, res, next) => {
  try {
    const bikeId = req.params.id;
    console.log("Requesting to delete bike with ID:", bikeId);
    console.log("Current User ID:", req.userId);

    // Find the bike
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return next(new HttpError("Bike not found.", 404));
    }

    console.log("Bike User ID:", bike.user.toString());

    // Check if the bike belongs to the current user
    if (bike.user.toString() !== req.userId.toString()) {
      return next(
        new HttpError("You do not have permission to delete this bike.", 403)
      );
    }

    // Remove the bike from the user's bike array
    await User.updateOne(
      { _id: bike.user }, // Match the user ID
      { $pull: { bikes: bikeId } } // Remove bike ID from the bikes array
    );

    // Delete the bike
    await bike.deleteOne();
    res.status(200).json({ message: "Bike deleted successfully" });
  } catch (err) {
    console.error("Error deleting bike:", err);
    return next(new HttpError("Error deleting bike!", 500));
  }
};

module.exports = {
  addBike,
  getUserBikes,
  updateBike,
  deleteBike,
  selectBike,
  geSelectedBike,
};
