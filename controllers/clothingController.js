const path = require("path");
const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");
const clothingItem= require("../app/models/clothingItem")


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
      const clothes = await db
        .collection("clothingitems")
        .find({ userId: req.user._id })
        .sort({ createdAt: -1 })
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
    console.log(req.body.season)
  },
  // Suggest outfits based on weather
  suggestOutfits: async (req, res, db) => {
    try {
      const { temperature, conditions } = req.query;
      const suggestions = await db
        .collection("clothes")
        .find({
          userId: req.user._id,
          season: getSeason(temperature),
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
    if (temperature < 45) return "winter";
    if (temperature < 65) return "spring";
    if (temperature < 85) return "summer";
    return "fall";
  },
};
