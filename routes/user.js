const express = require("express");
const router = express.Router();

const { userById } = require("../controller/user");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth");


//routes
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
});

//router middleware
router.param('userId', userById);

module.exports = router;