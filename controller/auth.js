const User = require('../model/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require('../helper/dbErrorHandler')


exports.signup = function(req, res) {
    
    const user = new User(req.body);

    user.save()
    .then(user => {
        if (!user) return res.status(400).json({error: "problem occurred when saving new user"}); 
        return res.json({ "name": user.name, "email": user.email, "about": user.about }); 
    })
    .catch(err => {
        return res.status(400).json({ error: err });  
    })
};

exports.signin = function(req, res) {

    const { email, password } = req.body;

    User.findOne({ email })
    .then(user => {
        if (!user) { 
            return res.status(400).json({ error: 'User does not exist' }); 
        }
        if(!user.authenticate(password)) { 
            return res.status(401).json({ error: 'Email and/or password wrong' }); 
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.cookie("auth", token, { expire: new Date() + 9999 });
       
        const { _id, name, email, role } = user;
        return res.json({ token, user: {_id, email, name, role} });
    })
    .catch(err => { 
        return res.status(400).json({ error: errorHandler(err) }); 
    });
};

exports.signout = (req, res) => {
    res.clearCookie("auth");
    res.json({ message: 'Signout success' })
}


exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
  });


exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({ error: "access denied"  });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(!req.profile.role == 1) {
        return res.status(403).json({
            error: "not an admin, access denied"
        });
    }
   next();
}

