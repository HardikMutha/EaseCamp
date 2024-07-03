const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title : String,
    location : String,
    description : String,
    price : Number,
    img : String,
});
module.exports =  mongoose.model('Campground',CampgroundSchema);
