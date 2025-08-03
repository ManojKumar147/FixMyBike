const Booking = require("../model/booking_model");
const HttpError = require("../model/http_error");
const User = require("../model/user_model");
const Service = require("../model/service_model");
const { sendNotification } = require("../src/service/fcmService");
const createBooking = async (req, res, next) => {
  try {
    let {
      service_id,
      serviceName,
      serviceBasePrice,
      name,
      cell,
      address,
      comments,
      bikeModel,
      bikeName,
      bikeCompanyName,
      bikeRegNumber,
      additionalServices,
      dropOff,
      totalPrice,
      mechanicName,
      mechanicNumber,
      mechanicId,
      sheduleDate,
      status
    } = req.body;
    
    if (service_id) {
      const shop_owner = await Service.findById(service_id).select('shop_owner');
      if (shop_owner) {
        const mechanic = await User.findById(shop_owner.shop_owner).select("full_name phone_number");
        console.log("mechanic", mechanic);
        mechanicName = mechanic.full_name;
        mechanicNumber = mechanic.phone_number;
        mechanicId = mechanic._id;
      }

    }
    
    const bookingData = {
      userId: req.userId,
      serviceName,
      serviceBasePrice,
      name,
      cell,
      address,
      comments,
      bikeModel,
      bikeName,
      bikeCompanyName,
      bikeRegNumber,
      additionalServices,
      totalPrice,
      dropOff,
      timestamp: Date.now(),
      mechanicName,
      mechanicNumber,
      mechanicId,
      status,
      scheduleDate: sheduleDate,
    };

    const booking = new Booking(bookingData);

    const savedBooking = await booking.save();

    res
      .status(201)
      .json({ message: "Booking created successfully", data: savedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};


const getBookingsToAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find();

    if (!bookings.length) {
      return next(new HttpError("No bookings yet.", 404));
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings for admin:', error);
    return next(new HttpError("Failed to fetch bookings.", 500));
  }
};


const getAllUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $and: [
        {
          $or: [
            { status: { $regex: /^in progress$/i } },
            { status: { $regex: /^accepted$/i } } // Also match "accepted"
          ]
        },
        { scheduleDate: { $ne: null } }, // Ensure scheduleDate is not null
        { mechanicId: req.user._id } // Match the mechanicId
      ]
    });

    if (!bookings.length) {
      return next(new HttpError("No booking yet.", 404));
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    return next(new HttpError("Error fetching bookings!", 500));
  }
};




const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({
      userId,
      status: { $in: ["in progress", "accepted"] },
    });


    if (!bookings.length) {
      return next(new HttpError("No bookings found for this user.", 404));
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    return next(new HttpError("Error fetching bookings!", 500));
  }
};
//checked
const getNotSheduleBookings = async (req, res, next) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({
      status: "pending",
      $or: [
        { mechanicId: req.user._id }, // Mechanic assigned to the user
        { mechanicId: null } // No mechanic assigned
      ]
    });
    res.status(200).json({
      count: bookings.length,
      Bookings: bookings, // Always send the array, even if it's empty
    });
  } catch (error) {
    return next(new HttpError("Error fetching bookings for shedule!", 500));
  }
};

//checked
const getUserBookingHistory = async (req, res, next) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({ userId, status: { $regex: /^completed$/i } });

    if (!bookings.length) {
      return next(
        new HttpError("No bookings history found for this user.", 404)
      );
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    return next(new HttpError("Error fetching bookings!", 500));
  }
};

//checked
const getAllUserBookingHistory = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $and: [
        { status: { $regex: /^completed$/i } }, // Status is 'completed'
        { mechanicId: req.user._id }           // mechanicId matches req.user._id
      ]
    });
    if (!bookings.length) {
      return next(
        new HttpError("No bookings history found yet.", 404)
      );
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    return next(new HttpError("Error fetching bookings!", 500));
  }
};


const getBookingById = async (req, res) => {

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching booking", error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  console.log('log req body',req.body);
  const { customerId} = req.body; 
  const userId = req.userId; // Assuming  the token is stored in the user model
  
  try {
    const user = await User.findById(customerId).select('fcm_token');
    const fcmToken = user ? user.fcm_token : null;
    console.log("fcmToken in user", fcmToken); // <-- Now it's defined

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.body.status,
        },
      },
      { new: true }
    );
    if (!updatedBooking)
      return res.status(404).json({ message: "Booking not found" });

    if (userId && fcmToken) {
      await sendNotification(
        fcmToken,
        'hello',
        `Your booking is now ${req.body.status}`
      );
    }

    res
      .status(200)
      .json({ message: "Booking status updated", data: updatedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
};
//
const updateBookingShedule = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let updateFields = { status: req.body.status || "accepted" }; // Always update status

    // Check if mechanic fields are empty
    if (!booking.mechanicName || !booking.mechanicNumber || !booking.mechanicId) {
      updateFields.mechanicName = req.user.full_name;
      updateFields.mechanicNumber = req.user.phone_number;
      updateFields.mechanicId = req.user._id;
    }

    // Update booking based on the determined fields
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.status(200).json({ message: "Booking updated successfully", data: updatedBooking });

  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
};

//


const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking)
      return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted", data: deletedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting booking", error: error.message });
  }
};

const getOilChange = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Calculate date 60 days ago
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const bookings = await Booking.find({
      userId,
      serviceName: "Engine Maintenance",
      status: { $regex: /^completed$/i },
      timestamp: { $lt: sixtyDaysAgo },
    });
    // If no old oil change requests are found, return an empty array with a message
    res.status(200).json({
      Bookings: bookings,
      message: bookings.length ? "Old oil change requests found." : "No old oil change required."
    });

  } catch (error) {
    return next(new HttpError("Error fetching oil change requests!", 500));
  }
};



module.exports = {
  createBooking,
  getAllUserBookings,
  getUserBookings,
  getNotSheduleBookings,
  getUserBookingHistory,
  getAllUserBookingHistory,
  updateBookingShedule,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getOilChange,
  getBookingsToAdmin,
};
