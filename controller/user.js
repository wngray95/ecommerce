const User = require('../model/user');

const { errorHandler } = require('../helper/dbErrorHandler')

exports.userById = (req, res, next, id) => {

    User.findById(id)
    .then(user => {
        if(!user) return res.status(404).json({ error: "user not found with id" });
        res.json({ user });
        next();
    })
    .catch(err => {
        res.status(400).json({ error: errorHandler(err) });
        next();
    });
}

exports.deleteById = (req, res) => {

    User.findByIdAndDelete(req.params.id)
    .then(user => { 
        return res.json({ user })  
    })
    .catch(err => { 
        return res.status(400).json({ error: errorHandler(err) }) 
    });
};