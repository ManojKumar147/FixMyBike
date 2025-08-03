const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require('http');
const userRoutes = require("./route/user_route");
const bikeRoutes = require("./route/bike_route");
const bookingRoutes = require('./route/booking_route');
const productRoutes = require('./route/product_route');
const ratingRoutes = require('./route/rating_route');
const serviceRoutes = require("./route/service_route");
const checkoutRoutes = require("./route/checkout_route");
const googleSigninRoutes = require("./route/google_signin_route");
const shopLocationRoutes = require("./route/shop_location_route"); 
const reviewRoutes = require("./route/review_route"); 
const feedbackRoutes = require("./route/feedback_route"); 

// const getAccessToken = require("./src/service/fcmService").getAccessToken;
// (async () => {
//   const token = await getAccessToken();
//   console.log("Access Token:", token);
// })();
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", userRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/social-auth", googleSigninRoutes);
// app.use("/api/service", serviceRoutes);
app.use("/api", bookingRoutes);
app.use("/api", productRoutes);
app.use("/api", serviceRoutes);
app.use("/api", ratingRoutes);
app.use("/api", checkoutRoutes);
app.use("/api/shop", shopLocationRoutes); 
app.use("/api", reviewRoutes);
app.use("/api", feedbackRoutes);



app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
   
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
