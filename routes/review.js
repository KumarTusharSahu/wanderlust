const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")


// Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router