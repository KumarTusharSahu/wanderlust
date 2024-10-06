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
        type: String,
        default: 'https://images.unsplash.com/photo-1591862264319-f00c75a0af32?q=80&w=1990&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', //used when user doesn't insert a image
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1591862264319-f00c75a0af32?q=80&w=1990&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,    //used when image is undefined/null/empty
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
    }

});

//MIDDLEWARE TO DELETE REVIEWS OF A LISTING AUTOMATICALLY IF LISTING GET DELETED
listSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = new mongoose.model("Listing", listSchema);

module.exports = Listing;