const express = require("express");
const router = express.Router();

const { signup, signin, signout, requireSignin } = require("../controller/auth");

const { userSignupValidator } = require("../validator");

//routes
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", requireSignin, signout);

module.exports = router;