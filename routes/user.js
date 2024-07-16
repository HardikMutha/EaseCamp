const express = require('express');
const router = express.Router();
//const User = require('../models/user');
const catchAsync = require('../utils/catchasync');
const passport = require('passport');
const usr = require('../controllers/users');


router.get('/register',(req,res)=>{
    res.render('../views/users/register');
});

router.post('/register',catchAsync(usr.addUser));

router.get('/login',(req,res)=>{
    res.render('users/login');});

router.post('/login',passport.authenticate('local',{failureFlash:true,failureMessage:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back Comrade!!!');
    res.redirect('/campgrounds');
});


module.exports = router;