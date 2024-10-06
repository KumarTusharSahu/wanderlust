const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema"); //For Joi Validation
const { reviewSchema } = require("./schema.js");

const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req);
    console.log(req.path, "--", req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;   //storing url that we are accessing in req.session by name redirectUrl so that it can be accessed from anywhere as we have access to request.session
        req.flash("error", "you must be logged in to do this");
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

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

//Joi Validation
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);   //validating that data from backend can't be incorrect
        console.log(error);

        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }
        else{
            next();
        }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);   //validating that data from backend can't be incorrect
        console.log(error);

        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }
        else{
            next();
        }
}