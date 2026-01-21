const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const MONGO_URL = "mongodb://127.0.0.1:27017/HavenStay";

main().then(() => {
    console.log("Connected to database");
}).catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.redirect("/listings");
  });

// index route
app.get("/listings", async (req,res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
}); 

// Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params; // Extract the ID specificially
    const foundListing = await listing.findById(id); // Use a different variable name here
    res.render("listings/show.ejs", { listing: foundListing }); // Pass it to EJS as "listing"
});

 //create route
app.post("/listings", async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//edit route

app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render("listings/edit.ejs", { listing: foundListing });
});

//Update route

app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const updatedListing = req.body.listing;
    // Preserve existing image object if only URL is being updated
    const existingListing = await listing.findById(id);
    if (updatedListing.image && updatedListing.image.url && !updatedListing.image.filename) {
        updatedListing.image.filename = existingListing.image?.filename || undefined;
    }
    await listing.findByIdAndUpdate(id, updatedListing);
    res.redirect(`/listings/${id}`);
});

// Delete route
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// app.get("/testListings", async(req, res) => {
//     let sampleListing = new listing({
//         title: "My new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "Maldives",
//         country: "Maldives",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Listing saved");

// });

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})