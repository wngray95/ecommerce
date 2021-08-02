const formidable = require('formidable');
const _ = require('lodash');
const Product = require("../model/product");
const fs = require('fs');
const { errorHandler } = require('../helper/dbErrorHandler')


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
            return res.json({ product });
        })
        .catch(err => {
            return res.status(400).json({ error: errorHandler(err) });
         });
    });
}

exports.deleteById = (req, res) => {

    Product.findByIdAndDelete(req.params.id)
    .then(product => { 
        return res.json({ deleted: product }) 
    })
    .catch(err => { 
        return res.status(400).json({ error: errorHandler(err) }) 
    });

}