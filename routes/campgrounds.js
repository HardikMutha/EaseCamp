const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchasync");
const campground = require("../models/campground");
const {CampgroundSchema} = require("../Schema");
const {isAllowed} = require('../middleware');
const cg = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage:storage});

async function validateCampground(req, res, next) {
    try {
      await CampgroundSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
}
const isAuthor = async(req,res,next)=>{
  const {id} = req.params;
  const cg1 = await campground.findById(id).populate('author');
  if(cg1.author[0] && !cg1.author[0]._id.equals(req.user._id))
    {
        req.flash('error','Permission Denied !!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

router.route('/campgrounds')
.get(catchAsync(cg.showAllCampgrounds))
.post(isAllowed,upload.array('image'),validateCampground,catchAsync(cg.makenewCampground));


router.get("/campgrounds/new",isAllowed,cg.renderNewCgForm);

router.route('/campgrounds/:id')
.get(catchAsync(cg.showCampground))
.put(isAllowed,isAuthor,upload.array('image'),validateCampground,catchAsync(cg.updateCampground))
.delete(isAllowed,isAuthor,catchAsync(cg.deleteCampground));

router.get("/campgrounds/:id/edit",isAllowed,isAuthor,
    catchAsync(cg.renderEditForm));

router.get('/logout',cg.logout)

module.exports = router;