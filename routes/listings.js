const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { validateListing } = require("../middleware");

// Index route
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

// New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const foundListing = await Listing.findById(id);
        if (!foundListing) {
            throw new ExpressError("Listing not found", 404);
        }
        res.render("listings/show.ejs", { listing: foundListing });
    })
);

// Create route
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

// Edit route
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const foundListing = await Listing.findById(id);
        if (!foundListing) {
            throw new ExpressError("Listing not found", 404);
        }
        res.render("listings/edit.ejs", { listing: foundListing });
    })
);

// Update route
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const updatedListing = req.body.listing;
        // Preserve existing image object if only URL is being updated
        const existingListing = await Listing.findById(id);
        if (!existingListing) {
            throw new ExpressError("Listing not found", 404);
        }
        if (updatedListing.image && updatedListing.image.url && !updatedListing.image.filename) {
            updatedListing.image.filename = existingListing.image?.filename || undefined;
        }
        await Listing.findByIdAndUpdate(id, updatedListing);
        res.redirect(`/listings/${id}`);
    })
);

// Delete route
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    })
);

module.exports = router;
