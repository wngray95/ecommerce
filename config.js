const mongoose = require('mongoose');
require('dotenv').config();



exports.dbConfig = () => {

    mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB Connected"))
    .catch((err => console.log("Error connecting to db: " + err)));
}