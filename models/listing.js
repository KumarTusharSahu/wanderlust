const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    

});

//MIDDLEWARE TO DELETE REVIEWS OF A LISTING AUTOMATICALLY IF LISTING GET DELETED
listSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = new mongoose.model("Listing", listSchema);

module.exports = Listing;