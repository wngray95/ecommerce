const express = require("express");

const router = express.Router();

const { create, deleteById } = require("../controller/product");
const { userById } = require("../controller/user");
const { isAuth, isAdmin, requireSignin } = require("../controller/auth");


//routes
router.post("/create", create);
router.delete("/delete/:id", /* isAuth, isAdmin, */ deleteById);


module.exports = router;