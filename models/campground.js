const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews.js');
const opts = {toJSON : {virtuals:true}};


const ImageSchema = new Schema({
    url : String,
    filename : String
});

const CampgroundSchema = new Schema({
    title : String,
    location : String,
    description : String,
    price : Number,
    img : [ImageSchema],
    geometry : {
        type:{
            type : 'String',
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }],
    author : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    delete : [{
        type : String
    }]
},opts);

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/c_thumb,w_200,g_face');
});

CampgroundSchema.virtual('properties.getPopUpTextForMap').get(function(){
    return `<h5>${this.title}</h5><p>Location : ${this.location}</p><a href=/campgrounds/${this._id}>Visit Campground</a><p>${this.description.substring(0,35)}.....</p>`;
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
