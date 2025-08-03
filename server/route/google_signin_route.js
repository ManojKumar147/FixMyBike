const express = require("express");
const googleSigninController = require("../controller/google_sigin_controller");
const router = express.Router();

router.post("/google-signin", googleSigninController.googleSignin);

module.exports = router;
