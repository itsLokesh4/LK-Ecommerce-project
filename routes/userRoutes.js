const express = require("express");
const { getSignUp, getLogIn, landingPage, otpPage, forgot, singlePage } = require("../controller/loginController");

const router = express.Router();




router.get("/", getLogIn);
router.get("/signup", getSignUp);
router.get("/otpPage", otpPage )
router.get("/landingPage", landingPage)
router.get("/forgot", forgot)
router.get("/singlePage", singlePage)


module.exports = router;
