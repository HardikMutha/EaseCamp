const campground = require("../models/campground");
const Review = require("../models/reviews");

module.exports.postNewReview = async (req, res) => {
    const campground1 = await campground.findById(req.params.id);
    const newreview = new Review(req.body);
    newreview.author = req.user;
    campground1.reviews.push(newreview);
    await campground1.save();
    await newreview.save();
    req.flash('success','Review Added Successfully');
    res.redirect(`/campgrounds/${campground1._id}`);
};


module.exports.deleteReview = async (req,res)=>{
    const {id,reviewid} = req.params;
    await campground.findByIdAndUpdate(id,{$pull:{ reviews: reviewid}});
    await Review.deleteOne({_id : reviewid});
    req.flash('success','Review Deleted Successfully');
    res.redirect(`/campgrounds/${id}`);
};
