const { errorHandler } = require("../helper/dbErrorHandler");
const Category = require("../model/category");


exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save()
    .then(catagory => {
        return res.json({ saved: catagory });
    })
    .catch(err => {
        return res.json({ error: err }); 
    });
}

exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
    .then(category => { return res.json({ deleted: category.name, id: category.id }) })
    .catch(err => { return res.status(400).json({ error: err }) })
}


exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save()
    .then(category => {
        return res.json({ saved: category });
    })
    .catch(err => {
        return res.json({ error: err }); 
    });
}


exports.getCategory = (req, res) => {
    return res.json({ category: req.category })
}

exports.getAllCategories = (req, res) => {
    Category.find()
    .then(data => {
        return res.json({ getAll: data });
    })
    .catch(err => {
        return res.json({ error: err }); 
    })
}

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
    .then(category => {
        if (!category) return res.status(404).json({ error : "category not found" })     
        req.category = category; 
        next();
    })
    .catch(err => { 
        return res.status(400).json({ error: err }); 
    })
}