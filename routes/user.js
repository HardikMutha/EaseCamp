const express = require('express');
const router = express.Router();
const User = require('../models/user');
//router.use(bodyParser.urlencoded({extended:true}));
const catchAsync = require('../utils/catchasync');
const passport = require('passport');


router.get('/register',(req,res)=>{
    res.render('../views/users/register');
});

router.post('/register',catchAsync(async(req,res)=>{
    try
    {
        const {username,email,password} = req.body;
        const newUser = new User({username:username,email:email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
    }
    catch(e)
    {
        console.log(e.message);
    }
    res.redirect('/campgrounds');
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    res.redirect('/campgrounds');
});

module.exports = router;