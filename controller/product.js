const formidable = require('formidable');
const _ = require('lodash');
const Product = require("../model/product");
const fs = require('fs');


exports.create = (req, res) => {

    //package to handle form data post requests
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //parse form data to product model
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).json({ error: 'Image could not be uploaded'});
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
        product.save((err, result) => {
            if (err) return res.json({ error: errorHandler(err) });
            return res.json({result});
         });
    });

    
}