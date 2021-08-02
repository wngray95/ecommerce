const express = require("express");

const router = express.Router();

const { create } = require("../controller/product");
const { userById } = require("../controller/user");
const { isAuth, isAdmin, requireSignin } = require("../controller/auth");


//routes
router.post("/create", create);

//router middleware
//router.param('userId', userById);

module.exports = router;