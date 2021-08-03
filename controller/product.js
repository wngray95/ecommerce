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
        return res.status(400).json({ error: errorHandler(err) }) 
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
            return res.json({ updated: product });
        })
        .catch(err => {
            return res.status(400).json({ error: "Error updating product", msg: err }) 
        });
    });
}

exports.getAllProducts = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.order ? req.query.sortBy : '_id';
    let limit = req.query.limit ? req.query.limit : 6

    Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .limit([[limit]])
    .exec((data, err) => {
        if(err || !data) return res.status(400).json({ msg : 'products not found' })
        return res.json({ products: data })
    })

}