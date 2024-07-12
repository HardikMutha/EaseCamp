const express = require('express')
const router = express.Router();
const {reviewSchema} = require("../Schema");
const catchAsync = require("../utils/catchasync");
const campground = require("../models/campground");
const path = require("path");
const campgrounds = require(path.join(__dirname, "../models/campground"));
const Review = require("../models/reviews");
const flash = require('connect-flash');
//const cookieParser = require('cookie-parser');
//const session = require('express-session');

async function validateReview(req,res,next){
    try
    {
        const data = await reviewSchema.validateAsync(req.body);
        next();
    }
    catch(err){
        next(err);
    }
};
//router.use(cookieParser());
//router.use(session({secret:'thisismysecretkey'}));



router.post("/campgrounds/:id/review",validateReview,
    catchAsync(async (req, res) => {
    const campground = await campgrounds.findById(req.params.id);
    console.log(req.body);
    const newreview = new Review(req.body);
    campground.reviews.push(newreview);
    await campground.save();
    await newreview.save();
    //req.flash('success','Review Added Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete('/campgrounds/:id/review/:reviewid',catchAsync(async (req,res)=>{
    console.log(req.params);
    const {id,reviewid} = req.params;
    await campground.findByIdAndUpdate(id,{$pull:{ reviews: reviewid}});
    await Review.deleteOne({_id : reviewid});
    res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;