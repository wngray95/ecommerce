const express = require("express");
const router = express.Router();

const { userById, deleteById, getUser, updateUser } = require("../controller/user");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth");


//routes
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
});

router.delete('/delete/:id', deleteById);
router.get('/:userId', getUser);
router.put('/:userId', requireSignin, isAuth, updateUser);

//router middleware
router.param('userId', userById);

module.exports = router;