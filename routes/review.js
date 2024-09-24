const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
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

// Post route

// in req we are using id which we get from req, but we didn't get id here as woh app.js me hi reh jaegi because there is written /listings/:id/reviews parent me hi reh jata hai if we want to use some param from parent to children then we use {mergeParams: true} option in router as used above
router.post("/", validateReview, wrapAsync(async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    console.log(listing)
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`)
}))

//Delete review
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}))

module.exports = router