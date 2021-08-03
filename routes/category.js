const express = require("express");
const { isAuth, isAdmin, requireSignin } = require("../controller/auth");
const router = express.Router();

const { create, deleteCategory, updateCategory, getCategory, getAllCategories, categoryById} = require("../controller/category");
const { userById } = require("../controller/user");


//routes
router.post("/create", create);
router.delete("/delete/:id", deleteCategory);
router.put("/update/:categoryId", updateCategory);
router.get("/get/:categoryId", getCategory);
router.get("/getAll/", getAllCategories);


//router middleware
router.param('userId', userById);
router.param('categoryId', categoryById);


module.exports = router;