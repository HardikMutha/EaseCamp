const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews.js');


const CampgroundSchema = new Schema({
    title : String,
    location : String,
    description : String,
    price : Number,
    img : [
        {
            url : String,
            filename : String
        }
    ],
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }],
    author : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }]
});

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc)
    {
        await Review.deleteOne({_id:{
            $in:doc.reviews
        }});
    }
});

module.exports =  mongoose.model('Campground',CampgroundSchema);
