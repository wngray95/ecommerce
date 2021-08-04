const express = require("express");

const router = express.Router();

const { create, deleteById, productById, 
        getProduct, deleteProduct, updateProduct, 
        getAllProducts, listRelated, listCategories, 
        listBySearch, getPhoto } = require("../controller/product");

const { userById } = require("../controller/user");
const { isAuth, isAdmin, requireSignin } = require("../controller/auth");


//routes
router.post("/create", create);
router.get("/get/:productId", getProduct)
router.delete("/delete/:id", /* isAuth, isAdmin, */ deleteById);
router.delete("/middleware/delete/:productId", deleteProduct);
router.put("/update/:productId", updateProduct);
router.get("/list", getAllProducts);
router.get("/related/:productId", listRelated);
router.get("/categories", listCategories);
router.post("/by/search", listBySearch);
router.get("/photo/:productId", getPhoto);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;