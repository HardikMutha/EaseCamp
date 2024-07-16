const express = require('express')
const router = express.Router();
const {reviewSchema} = require("../Schema");
const catchAsync = require("../utils/catchasync");
const rw = require('../controllers/reviews');
const Review = require("../models/reviews");
const {isAllowed} = require('../middleware');

async function validateReview(req,res,next){
    try
    {
        await reviewSchema.validateAsync(req.body);
        next();
    }
    catch(err){
        next(err);
    }
};

//router.use(cookieParser());
//router.use(session({secret:'thisismysecretkey'}));
const isReviewOwner = async(req,res,next)=>{
    const {reviewid} = req.params;
    const {id} = req.params;
    const rev = await Review.findById(reviewid).populate('author');
    if(!rev.author._id.equals(req.user.id))
    {
        req.flash('error','Not Allowed')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

router.post("/campgrounds/:id/review",isAllowed,validateReview,catchAsync(rw.postNewReview));

router.delete('/campgrounds/:id/review/:reviewid',isAllowed,isReviewOwner,catchAsync(rw.deleteReview));

module.exports = router;