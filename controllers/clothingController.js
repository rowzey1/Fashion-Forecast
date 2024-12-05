const path = require("path");
const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");
const clothingItem = require("../app/models/clothingItem");

module.exports = {
  // Add a clothing item
  addClothingItem: async (req, res, db) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await clothingItem.create({
        userId: req.user._id,
        image: result.secure_url,
        category: req.body.category,
        season: req.body.season,
        cloudinaryId: result.public_id,
        createdAt: new Date(),
      });

      req.flash("success", "Item added to your closet!");
      res.redirect("/wardrobe");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding clothing item");
    }
  },
  //Get virtual closet
  getWardrobe: async (req, res, db) => {
    try {
      const { seasonFilter } = req.query;
      const query = { userId: req.user._id };

      if (seasonFilter) {
        const seasons = seasonFilter.split(",");
        query.season = { $in: seasons };
      }

      const clothes = await db
        .collection("clothingitems")
        .find({ userId: req.user._id })
        .sort({ category: 1 })
        .toArray();

      res.render("wardrobe.ejs", {
        user: req.user,
        clothes: clothes,
        messages: {
          success: req.flash("success"),
          error: req.flash("error"),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading wardrobe");
    }
    console.log(req.body.season);
  },
  getOutfitPage: async (req, res, db) => {
    try {
      // Fetch user's location and weather data
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
          location = { lat: 42.4125, lon: -71.0034 }; // Default set to MA
        }
      }

      // Fetch weather data
      if (location) {
        weather = await WeatherService.getWeatherByLocation(
          location.lat,
          location.lon
        );
      }

      // Render the outfit page with weather data
      res.render("outfit.ejs", {
        user: req.user,
        weather: weather, // Pass weather data to the view
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading outfit page");
    }
  },
  // Suggest outfits based on weather
  suggestOutfits: async (req, res, db) => {
    try {
      const { temperature } = req.query;
      const seasons = getSeason(parseInt(temperature));
      const suggestions = await db
        .collection("clothingitems")
        .find({
          userId: req.user._id,
          season: { $in: seasons },
        })
        .toArray();

      res.json(suggestions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error getting suggestions" });
    }
  },
  // Helper function to determine season
  getSeason: (temperature) => {
    const seasons = [];
    if (temperature < 45) {
      seasons.push("Winter");
    }
    if (temperature >= 45 && temperature < 65) {
      seasons.push("Spring");
    }
    if (temperature >= 65 && temperature < 85) {
      seasons.push("Summer");
    }
    if (temperature >= 85) {
      seasons.push("Fall");
    }
    return seasons;
  },
};
