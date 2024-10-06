const Listing = require("../models/listing");
const Review = require("../models/review");

// in req we are using id which we get from req, but we didn't get id here as woh app.js me hi reh jaegi because there is written /listings/:id/reviews parent me hi reh jata hai if we want to use some param from parent to children then we use {mergeParams: true} option in router as used above
module.exports.createReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    console.log(listing)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`)
}