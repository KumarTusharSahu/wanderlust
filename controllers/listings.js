const Listing = require("../models/listing");
const axios = require("axios");

const GEOCODE_API_KEY = process.env.OPENCAGE_API_KEY;

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    console.log("Session:", req.session);
    console.log("User:", req.user);
    res.render("listings/new.ejs");
}

//populate : har ek listing ke sath uske saare reviews aa jaye aur us review ke saath uska author aa jae
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing Not Exists!");
        res.redirect("/listings");
    }

    console.log(listing);

    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    try {
        const url = req.file.path;
        const filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        // Forward Geocoding to get coordinates from location name
        const locationName = req.body.listing.location; // Location name from the form
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: locationName,
                key: GEOCODE_API_KEY
            }
        });

        console.log("respose : ", response.data.results[0].geometry);

        // Check if we got results from the geocoding API
        if (response.data.results.length > 0) {
            const coordinates = response.data.results[0].geometry; // Get the first result
            newListing.locationCoords = {
                type: "Point",
                coordinates: [coordinates.lng, coordinates.lat] // Store longitude and latitude
            };
        } else {
            req.flash("error", "Location not found!");
            return res.redirect("/listings/new");
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error creating listing.");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Not Exists!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    //changing quality of image while showing on edit form we can also blur image refer cloudinary website here we are changing pixels
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")

    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing.")
    }
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}