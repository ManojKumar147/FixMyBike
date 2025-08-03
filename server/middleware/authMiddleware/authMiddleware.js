const jwt = require("jsonwebtoken");
const User = require("../../model/user_model");
const HttpError = require("../../model/http_error");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError("Missing Token", 401));
  }

  const jwtToken = authHeader.replace("Bearer ", "").trim();

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET Is Not Defined In Environment Variables");
    }

    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (!isVerified || !isVerified.user || !isVerified.user.id) {
      return next(
        new HttpError("Invalid Token Structure Or Missing User Id", 401)
      );
    }

    const userData = await User.findById(isVerified.user.id).select(
      "-password"
    );

    if (!userData) {
      return next(new HttpError("User Not Found", 404));
    }
    req.token = jwtToken;
    req.user = userData;
    req.userId = userData._id;
    req.userType = userData.role;

    next();
  } catch (error) {
    console.error("Error Verifying Token:", error.message || error);
    return next(new HttpError("Unauthorized Token", 401));
  }
};

module.exports = authMiddleware;
