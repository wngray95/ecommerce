const express = require("express");
const { isAuth, isAdmin, requireSignin } = require("../controller/auth");
const router = express.Router();

const { create, deleteById } = require("../controller/category");
const { userById } = require("../controller/user");


//routes
router.post("/create/:userId", requireSignin ,isAuth, isAdmin, create);
router.delete("/delete/:id", deleteById);


//router middleware
router.param('userId', userById);

module.exports = router;