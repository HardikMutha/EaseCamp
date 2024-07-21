if(process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}


const URL = "mongodb://localhost:27017/Campground";
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require('./routes/user');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const passport = require('passport');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');


mongoose.connect(URL).then(() => {
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
app.use(cookieParser());
app.use(session({secret:'thisismysecretkey',resave:false,saveUninitialized:true,cookie:{httpOnly:true,maxAge:1000*60*60*24*3}}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
passport.use(User.createStrategy());
app.use(helmet({contentSecurityPolicy:false}));

app.use((req,res,next)=>
{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  next();
});

app.use("/", campgroundRoutes);
app.use("/", reviewRoutes);
app.use("/",userRoutes);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//const sessionConfig = {secret:'thisismysecretkey',saveUninitialized:false,resave:false,cookie:{secure : true}}; 
// We can also define what kind of options our cookie which is being sent back should have with it
//This is achieved using cookie object with *session config* 
//maxAge and expires are two properties which are used to set the timeout of the function.

app.listen(3000, () => {
  console.log("Listening on port 3000");
});


app.get("/", (req, res) => {
  res.render("homepg");
});

app.use((err, req, res, next) => {
  if (!err.message) err.message = "Something Went Wrong";
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).render("campgrounds/errors", { err });
});

