module.exports.isLoggedin = (req, res , next) => {
    if(!req.user)
    {
        req.flash('error', "Sign up/Sign in First");
        res.redirect('/admin/login')
    }else
    {
        return next();
    }
}