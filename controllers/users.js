const User = require('../models/user');


module.exports.addUser = async(req,res,next)=>{
    try
    {
        const {username,email,password} = req.body;
        const newUser = new User({username:username,email:email});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err)
                return next(err);
            req.flash('success','Welcome to Camp Ease');
            res.redirect('/campgrounds');
        });
    }

    catch(e)
    {
        console.log(e.message);
        req.flash('failure','Sorry, User was not added, Please Try Again');
        res.redirect('/login');
    }
};
