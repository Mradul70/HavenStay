const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { validateListing, isLoggedIn } = require("../middleware");

// Index route
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const q = req.query.q;
        const filter = {};
        if (q && q.trim()) {
            const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [
                { location: { $regex: regex } },
                { title: { $regex: regex } },
            ];
        }
        const allListings = await Listing.find(filter);
        res.render("listings/index.ejs", { allListings, q: q || "" });
    })
);

// New route (form page - protect so only logged-in can add)
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Book route (must be before /:id)
router.get(
    "/:id/book",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const foundListing = await Listing.findById(id);
        if (!foundListing) {
            throw new ExpressError(404, "Listing not found");
        }
        res.render("listings/book.ejs", { listing: foundListing });
    })
);

// Book confirm (mock) - redirect to /listings with flash
router.post(
    "/:id/book/confirm",
    wrapAsync(async (req, res) => {
        req.flash("success", "Booking Requested!");
        res.redirect("/listings");
    })
);

// Show route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const foundListing = await Listing.findById(id).populate("reviews");
        if (!foundListing) {
            throw new ExpressError(404, "Listing not found");
        }
        res.render("listings/show.ejs", { listing: foundListing });
    })
);

// Create route
router.post(
    "/",
    isLoggedIn,
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
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const foundListing = await Listing.findById(id);
        if (!foundListing) {
            throw new ExpressError(404, "Listing not found");
        }
        res.render("listings/edit.ejs", { listing: foundListing });
    })
);

// Update route
router.put(
    "/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const updatedListing = req.body.listing;
        // Preserve existing image object if only URL is being updated
        const existingListing = await Listing.findById(id);
        if (!existingListing) {
            throw new ExpressError(404, "Listing not found");
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
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    })
);

module.exports = router;
