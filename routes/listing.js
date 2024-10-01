const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema"); //For Joi Validation
const ExpressError = require("../utils/ExpressError");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


//Joi Validation
const validateListing = (req, res, next) => {
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

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
}))


//New Route
router.get("/new", isLoggedIn, (req, res) => {
    console.log("Session:", req.session);
    console.log("User:", req.user);
    res.render("listings/new.ejs");
})

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if(!listing){
        req.flash("error", "Listing Not Exists!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}))

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
        // let {title, descripton, image, price, country, location} = req.body;
        // let listing = req.body.listing;
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    }) 
)

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Exists!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}))

//Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing.")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}))

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}))

module.exports = router;