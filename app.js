if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
  }
  
  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  const path = require("path");
  const methodOverride = require("method-override");
  const ejsMate = require("ejs-mate");
  const ExpressError = require("./utils/ExpressError");
  
  // Import the new Router
  const listingsRouter = require("./routes/listings.js");
  const reviewsRouter = require("./routes/reviews.js"); 
  
  const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/HavenStay";
  
  main()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });
  
  async function main() {
    await mongoose.connect(MONGO_URL);
  }
  
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.engine("ejs", ejsMate);
  app.use(express.static(path.join(__dirname, "/public")));
  
  // Root Route
  app.get("/", (req, res) => {
    res.redirect("/listings");
  });
  
  // Use the Listings Router (This was the broken part)
  app.use("/listings", listingsRouter);
  
  // Use the Reviews Router
  app.use("/listings/:id/reviews", reviewsRouter);
  
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