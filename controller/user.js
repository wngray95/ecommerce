const User = require('../model/user');

exports.userById = (req, res, next, id) => {

    User.findById(id)
        .exec( (err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                })
            }
            req.profile = user;
            next();
    })
}

exports.deleteById = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .exec((err, User) => {
            if (err) return res.status(400).json({
                error: err
            });
            return res.json({
                user: User
            })
        })
}