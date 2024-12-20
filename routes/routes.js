const fs = require("fs");
const path = require("path");
const {
  addClothingItem,
  deleteClothingItem,
  getWardrobe,
  suggestOutfits,
} = require("../controllers/clothingController");
const GeoLocationService = require("../services/geoLocationservice");
const WeatherService = require("../services/weatherService");
const weatherController = require('../controllers/weatherController');
const clothingController = require('../controllers/clothingController');
const favoriteController = require('../controllers/favoriteController');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// normal routes ===============================================================

module.exports = function (app, passport, db) {
  // Home page
  app.get("/", (req, res) => {
    res.render("index.ejs");
  });

  // Profile section
  app.get("/profile", isLoggedIn, async (req, res) => {
    try {
      const clothingCount = await db
        .collection("clothes")
        .countDocuments({ userId: req.user._id });
      const outfitCount = await db
        .collection("outfits")
        .countDocuments({ userId: req.user._id });

      // Check if location exists
      let weather = null;
      let location = req.user.location;

      // Fetch and save location if not available
      if (!location || !location.lat || !location.lon) {
        try {
          location = await GeoLocationService.getLatLon(); // Fetch location from API
          req.user.location = location; // Update user profile with location
          await req.user.save();
        } catch (err) {
          console.error("Location Error:", err.message);
          location = { lat: 42.4125, lon: -71.0034 }; //Default set to MA
        }
      }

      // Fetch weather data
      if (location) {
        weather = await WeatherService.getWeatherByLocation(
          location.lat,
          location.lon
        );
      }

      res.render("profile.ejs", {
        user: req.user,
        clothingCount,
        outfitCount,
        weather,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading profile");
    }
  });

  // Logout
  app.get("/logout", (req, res) => {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });

  // Wardrobe routes
  app.post("/wardrobe/add", isLoggedIn, upload.single("image"), (req, res) => {
    addClothingItem(req, res, db);
  });

  app.get("/wardrobe", isLoggedIn, (req, res) => {
    getWardrobe(req, res, db);
  });

  app.delete("/wardrobe/delete/:id", isLoggedIn, (req, res) => {
    deleteClothingItem(req, res, db); 
  });

  app.get("/outfit", isLoggedIn, async (req, res) => {
    try {
      const outfits = await suggestOutfits(req, res, db); // Fetch outfit suggestions
      res.render("outfit.ejs", { user: req.user, outfits }); // Render the outfit page with suggestions
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading outfit suggestions");
    }
  });

  app.get("/outfits/suggest", isLoggedIn, (req, res) => {
    suggestOutfits(req, res, db);
  });

  app.get("/api/weather", isLoggedIn, weatherController.getWeather);

  app.get("/fave", isLoggedIn, favoriteController.getFavoriteOutfits);

  app.post("/favorites/save", isLoggedIn, favoriteController.saveFavoriteOutfit);

  app.delete("/favorites/delete/:id", isLoggedIn, favoriteController.deleteFavoriteOutfit);

  // Authentication routes
  app.get("/login", (req, res) => {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.get("/signup", (req, res) => {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  app.get("/unlink/local", isLoggedIn, (req, res) => {
    const user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.local.username = undefined;
    user.save((err) => {
      res.redirect("/profile");
    });
  });

  // Middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
  }
};
