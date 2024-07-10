const URL = "mongodb://localhost:27017/Campground";
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const campground = require("./models/campground");
const campgrounds = require(path.join(__dirname, "/models/campground"));
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchasync");
const { CampgroundSchema, reviewSchema } = require("./Schema");
const Review = require("./models/reviews");

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Error Connecting to Database");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static('./statics/'));


async function validateCampground(req, res, next) {
  try {
    const data = await CampgroundSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
}

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


app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get("/", (req, res) => {
  res.render("homepg");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const allcampgrounds = await campgrounds.find({});
    res.render("campgrounds/index", { allcampgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("./campgrounds/newcamp");
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/newcamp");
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const camground = await campgrounds.findById(req.params.id).populate('reviews');
    res.render("campgrounds/show", { camground });
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newcg = req.body;
    try {
      await CampgroundSchema.validateAsync(newcg);
      const newcg1 = new campground(newcg);
      await newcg1.save();
      res.redirect(`/campgrounds/${newcg1._id}`);
    } catch (err) {
      const msg = err.details.map((el) => el.message).join(",");
      err.message = msg;
      err.statusCode = 400;
      next(err);
    }
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const camground = await campgrounds.findById(req.params.id);
    res.render("campgrounds/edit", { camground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const nice = req.body;
    await campground.findByIdAndUpdate(id, nice);
    res.redirect(`/campgrounds/${id}`);
  })
);

app.post("/campgrounds/:id/review",validateReview,
    catchAsync(async (req, res) => {
    const campground = await campgrounds.findById(req.params.id);
    console.log(req.body);
    const newreview = new Review(req.body);
    campground.reviews.push(newreview);
    await campground.save();
    await newreview.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete('/campgrounds/:id/review/:reviewid',catchAsync(async (req,res)=>{
    console.log(req.params);
    const {id,reviewid} = req.params;
    await campground.findByIdAndUpdate(id,{$pull:{ reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/campgrounds/${id}`);
}));



app.delete("/campgrounds/:id",catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));





app.use((err, req, res, next) => {
  if (!err.message) err.message = "Something Went Wrong";
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).render("campgrounds/errors", { err });
});
