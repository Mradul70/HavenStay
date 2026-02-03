if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
  }
  
  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  const path = require("path");
  const methodOverride = require("method-override");
  const ejsMate = require("ejs-mate");
  const session = require("express-session");
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const ExpressError = require("./utils/ExpressError");
  const User = require("./models/user.js");
  
  // Import the new Router
  const listingsRouter = require("./routes/listings.js");
  const reviewsRouter = require("./routes/reviews.js");
  const usersRouter = require("./routes/users.js"); 
  

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/HavenStay";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
  
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.engine("ejs", ejsMate);
  app.use(express.static(path.join(__dirname, "/public")));
  
  const sessionOptions = {
    secret: process.env.SESSION_SECRET || "havenstay-secret-key",
    resave: false,
    saveUninitialized: true,
  };
  app.use(session(sessionOptions));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.q = req.query.q || "";
    next();
  });
  
  // Root Route
  app.get("/", (req, res) => {
    res.redirect("/listings");
  });
  
  // Use the Listings Router (This was the broken part)
  app.use("/listings", listingsRouter);
  
  // Use the Reviews Router
  app.use("/listings/:id/reviews", reviewsRouter);
  
  // Use the Users Router
  app.use("/", usersRouter);
  
  // 404 Handler (For all other routes)
  app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
  });
  
  // Global Error Handler
  app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
  });
  
  app.listen(8080, () => {
    console.log("Server is listening on port 8080");
  });