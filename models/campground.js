const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews.js');

const CampgroundSchema = new Schema({
    title : String,
    location : String,
    description : String,
    price : Number,
    img : String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc)
    {
        await Review.remove({_id:{
            $in:doc.reviews
        }});
    }
});

module.exports =  mongoose.model('Campground',CampgroundSchema);
