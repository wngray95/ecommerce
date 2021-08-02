const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            maxlength: 32,
            required: true
        },
        quantity: {
            type: Number
        },
        photo: {
            data: Buffer,
            contentType: String 
        },
        shipping: {
            type: Boolean,
            required: false
        }
    }, 
    {timestamps: true}
);

module.exports = mongoose.model("Product", productSchema);

