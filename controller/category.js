const { errorHandler } = require("../helper/dbErrorHandler");
const Category = require("../model/category");


//CREATE category
exports.create = (req, res) => {
    
    const category = new Category(req.body);
    
    category.save()
    .then(data => {
        return res.json({ data });
    })
    .catch(err => {
        return res.json({ error: errorHandler(err) }); 
    });
}

//DELETE category by Id
exports.delete = (req, res) => {
    
    Category.findByIdAndDelete(req.params.id)
    .then(data => {
        if(!data) return res.status(404).json({ error: "catgeory not found with id" }) 
        return res.json({ data })
    })
    .catch(err => {
        res.status(400).json({ error: errorHandlge(err) });
    })
}