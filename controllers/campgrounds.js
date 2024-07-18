const campground = require("../models/campground");
//const catchAsync = require("../utils/catchasync");
//const campground = require("../models/campground");
const {CampgroundSchema} = require("../Schema");
//const {isAllowed} = require('../middleware');

module.exports.showAllCampgrounds = async (req, res) => {
    const allcampgrounds = await campground.find({});
    res.render("campgrounds/index", { allcampgrounds });
};


module.exports.makenewCampground = async (req, res, next) => {
    const newcg = req.body;
    try
    {
      await CampgroundSchema.validateAsync(newcg);
      const newcg1 = new campground(newcg);
      newcg1.author = req.user._id;
      const imgs = req.files.map(f=>({url : f.path,
        filename : f.filename}));
      newcg1.img = imgs
      await newcg1.save();
      console.log(newcg1);
      req.flash('success','Campground added successfully');
      res.redirect(`/campgrounds/${newcg1._id}`);
    }
    catch (err) 
    {
      const msg = err.details.map((el) => el.message).join(",");
      req.flash('failure','Campground was not created please try again');
      err.message = msg;
      err.statusCode = 400;
      next(err);
    }
};

module.exports.showCampground = async (req, res) => {
    const camground = await campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    if(!camground)
    {
      req.flash('error','Requested campground does not exist');
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", {camground});
}

module.exports.renderNewCgForm = (req, res) => {
    res.render("campgrounds/newcamp");
};


module.exports.renderEditForm = async (req, res) => {
    const camground = await campground.findById(req.params.id);
    res.render("campgrounds/edit", { camground });
};

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const nice = req.body;
    const imgs = req.files.map(f=>({url : f.path,
      filename : f.filename}));
    console.log(imgs);
    cg1 = await campground.findByIdAndUpdate(id,nice);
    cg1.img.push(...imgs);
    console.log(cg1);
    await cg1.save();
    req.flash('success','Campground successfully Updated');
    res.redirect(`/campgrounds/${id}`);
  };

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','Campground Deleted Successfully');
    res.redirect("/campgrounds");
};

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
      if(err)
      {
        req.flash('error','Please try again');
        res.redirect('/campgrounds');
      }
      else
      {
        req.flash('success','GoodBye!!');
        res.redirect('/campgrounds');
      }
    });
};