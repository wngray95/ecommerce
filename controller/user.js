const User = require('../model/user');

const { errorHandler } = require('../helper/dbErrorHandler')

exports.userById = (req, res, next, id) => {
    User.findById(id)
    .then(user => {
        if(!user) return res.status(404).json({ error: "user not found with id" });
        req.profile = user; 
        // res.json({ user });
        next();
    }).catch(err => {
        return res.status(400).json({ error: err });
    });
};

exports.deleteById = (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(user => { 
        if (!user) return res.status(404).json({ error: "user not found with id" });
        return res.json({ deleted : user });  
    }).catch(err => { 
        return res.status(400).json({ error: err }); 
    });
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true })
    .then(user => {
        if (!user) return res.status(404).json({error: "user not found"});
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json(user); 
    })
    .catch(err => {
        return res.status(400).json({error: err});
    })
}

