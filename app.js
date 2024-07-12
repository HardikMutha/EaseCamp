const URL = "mongodb://localhost:27017/Campground";
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');



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
app.use(express.static("./statics/"));
app.use(flash());
app.use(cookieParser());
app.use(session({secret:'thisismysecretkey',resave:false,saveUninitialized:true,cookie:{httpOnly:true,secure:true,maxAge:1000*60*60}}));
app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  next();
});


app.use("/", campgroundRoutes);
app.use("/", reviewRoutes);


//const sessionConfig = {secret:'thisismysecretkey',saveUninitialized:false,resave:false,cookie:{secure : true}}; 
// We can also define what kind of options our cookie which is being sent back should have with it
//This is achieved using cookie object with *session config* 
//maxAge and expires are two properties which are used to set the timeout of the function.

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.render("homepg");
});

app.use((err, req, res, next) => {
  if (!err.message) err.message = "Something Went Wrong";
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).render("campgrounds/errors", { err });
});
