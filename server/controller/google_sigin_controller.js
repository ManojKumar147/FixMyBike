const { OAuth2Client } = require("google-auth-library");
const User = require("../model/user_model");
const HttpError = require("../model/http_error");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignin = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new HttpError("No Google ID token provided!", 400));
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // User does not exist, create a new one
      user = new User({
        full_name: name,
        email,
        password: null, // No password needed for Google Sign-In
        phone_number: "", // You can prompt for this later
        role: "customer", // Default role or can be set via additional logic
        profile_image: picture,
      });
      await user.save();
    }

    // Generate JWT Token for the user
    const jwtPayload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    jwt.sign(jwtPayload, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        return next(new HttpError("Error generating token", 500));
      }

      res.status(200).json({
        message: "Google SignIn Successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          profile_image: user.profile_image,
        },
      });
    });
  } catch (error) {
    console.error("Error verifying Google ID token:", error.message);
    return next(new HttpError("Invalid Google ID token", 401));
  }
};

module.exports = { googleSignin };
