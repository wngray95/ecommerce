const express = require("express");
const router = express.Router();

const { userById, deleteById } = require("../controller/user");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth");


//routes
router.get('/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
});

router.delete('/delete/:id', deleteById);

//router middleware
router.param('userId', userById);

module.exports = router;