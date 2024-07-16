
const isAllowed = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.flash('error','You must be Signed in to do this');
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
};

const storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo)
    {
        res.locals.returnTo = req.locals.returnTo;
    }
    next();
};

module.exports = {isAllowed,storeReturnTo};