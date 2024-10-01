module.exports.isLoggedIn = (req, res, next) => {
    console.log(req);
    console.log(req.path, "--", req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;   //storing url that we are accessing in req.session by name redirectUrl so that it can be accessed from anywhere as we have access to request.session
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

//after failureRedirect in authenticate method in router.post("/login") passport resets session so our redirectUrl gets deleted so we store it in our locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}