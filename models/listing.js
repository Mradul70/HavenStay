const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1757415285397-851116ff9140?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;