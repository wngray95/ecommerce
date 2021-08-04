const formidable = require('formidable');
const _ = require('lodash');
const Product = require("../model/product");
const fs = require('fs');
const { errorHandler } = require('../helper/dbErrorHandler');
const product = require('../model/product');


exports.create = (req, res) => {
    //package to handle form data post requests
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //parse form data to product model
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).json({ error: 'Image could not be uploaded'});
        
        //Form field required validation
        const {name,desciption,price,catagory,quantity} = fields;
        if ( !(name || desciption || price || catagory || quantity) ) {
            return res.status(400).json({ error: 'required field is missing'});
        }
        
        // create new product
        let product = new Product(fields);

        // if there is a photo, do there following
        if(files.photo) {
            //limit image upload to 1mb
            if(files.photo.size > 1000000) return res.status(400).json({error: "image must be 1mb or less in size"})
            product.photo.data = fs.readFileSync(files.photo.path); 
            product.photo.contentType = files.photo.type;
        }

        //save product using mongoose
        product.save()
        .then(product => {
            return res.json({ saved: product.name, id: product.id });
        })
        .catch(err => {
            return res.status(400).json({ error: errorHandler(err) });
         });
    });
}

exports.deleteById = (req, res) => {
    Product.findByIdAndDelete(req.params.id)
    .then(product => { 
        if(!product) {
            return res.status(404).json({ error: "Product not found" })
        }
        return res.json({ deleted: product.name, id: product.id }) 
    })
    .catch(err => { 
        return res.status(400).json({ error: errorHandler(err) }) 
    });
}

exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .then(product => {
        if(!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        req.product = product;
        next();
    })
    .catch(err => {
        return res.status(400).json({ error: err }) 
    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json({ product: req.product });
}

exports.deleteProduct = (req, res) => {
    Product.deleteOne(req.product)
    .then(result => {
        return res.json({ deleted: req.product.name, id: req.product.id });
    })
    .catch(err => {
        return res.status(400).json({ error: err }) 
    });
}


exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //parse form data to product model
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).json({ error: 'Image could not be uploaded'});
        //Form field required validation
        const {name,desciption,price,catagory,quantity} = fields;
        if ( !(name || desciption || price || catagory || quantity) ) {
            return res.status(400).json({ error: 'required field is missing'});
        }
        // create new product
        let product = req.product;
        product = _.extend(product, fields)
        //photo upload validation
        if(files.photo) {
            //limit image upload to 1mb
            if(files.photo.size > 1000000) return res.status(400).json({error: "image must be 1mb or less in size"})
            product.photo.data = fs.readFileSync(files.photo.path); 
            product.photo.contentType = files.photo.type;
        };
        product.save()
        .then(product => {
            if (!product) return res.status(404).json({ error: "Product not found" });
            return res.json({ updated: {name: product.name, id: product.id } });
        })
        .catch(err => {
            return res.status(400).json({ error: "Error updating product", msg: err }) 
        });
    });
}


/**
 * product/list?sortBy={var1}&order={var2}&limit={var3} 
 */
exports.getAllProducts = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, data) => {
        if(err) return res.status(400).json({ error: err })
        return res.json({ products: data })
    })

}

/**
 * product/related/:productId?sortBy={var1}&order={var2}&limit={var3} 
 */
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    console.log("in list related")

    Product.find({ _id: {$ne: req.product.id}, category: req.product.category })
    .select("-photo")
    .populate('category', '_id name')
    .limit(limit)
    .exec((err, data) => {
        if (err) return res.status(400).json({ error: err })
        return res.json({products: data});
    })
}

exports.listCategories = (req, res) => {
    Product.distinct('category')
    .then(categories => {
        if(!categories) return res.status(400).json({error: "categories not found"});
        return res.json({ categories }); 
    })
    .catch(err => res.json({error: err}))
}

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte - greater than price [0-10] lte - less than
                findArgs[key] = { $gte: req.body.filters[key][0], $lte: req.body.filters[key][1] };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
        if (err) { return res.status(400).json({ error: "Products not found" });}
        res.json({ size: data.length, data});
    });
};


exports.getPhoto = (req, res, next) => {

    if(req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}