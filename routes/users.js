const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");

// GET /signup - render signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// POST /signup - register and auto login
router.post("/signup", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        await User.register(user, password);
        req.login(user, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to HavenStay!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

// GET /login - render login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// POST /login - authenticate and keep user logged in
router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: "Invalid username or password.",
        failureRedirect: "/login",
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/listings");
    }
);

// GET /logout - destroy session and redirect home
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
});

module.exports = router;
