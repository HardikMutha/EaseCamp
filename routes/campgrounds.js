const express = require('express');
const path = require('path');
const router = express.Router();
const catchAsync = require("../utils/catchasync");
const campground = require("../models/campground");
const {CampgroundSchema} = require("../Schema");
const campgrounds = require(path.join(__dirname, "../models/campground"));

async function validateCampground(req, res, next) {
    try {
      await CampgroundSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
}


router.get("/campgrounds",catchAsync(async (req, res) => {
    const allcampgrounds = await campgrounds.find({});
    res.render("campgrounds/index", { allcampgrounds });
  })
);


router.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/newcamp");
});

router.get("/campgrounds/:id",
  catchAsync(async (req, res) => {
  const camground = await campgrounds.findById(req.params.id).populate('reviews');
  if(!camground)
  {
    return res.redirect('/campgrounds');
  }
  res.render("campgrounds/show", {camground});
}));

router.post("/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newcg = req.body;
    try 
    {
      await CampgroundSchema.validateAsync(newcg);
      const newcg1 = new campground(newcg);
      await newcg1.save();
      res.redirect(`/campgrounds/${newcg1._id}`);
    }
    catch (err) 
    {
      const msg = err.details.map((el) => el.message).join(",");
      err.message = msg;
      err.statusCode = 400;
      next(err);
    }
  })
);

router.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const camground = await campgrounds.findById(req.params.id);
    res.render("campgrounds/edit", { camground });
  })
);

router.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const nice = req.body;
    await campground.findByIdAndUpdate(id, nice);
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete("/campgrounds/:id",catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

module.exports = router;