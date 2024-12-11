const path = require("path");
const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");
const clothingItem = require("../app/models/clothingItem");
const FavoriteOutfit = require('../app/models/favoriteItem');
const GeoLocationService = require("../services/geoLocationservice");
const WeatherService = require("../services/weatherService");
const { getSeason } = require("./seasonController");
const { getWeather } = require("./weatherController");
const geoLocationservice = require("../services/geoLocationservice");
const weatherService = require("../services/weatherService");

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
  // Delete a clothing item
  deleteClothingItem: async (req, res, db) => {
    try {
      const { ObjectId } = require("mongodb");
      const itemId = req.params.id;
      await db
        .collection("clothingitems")
        .deleteOne({ _id: new ObjectId(itemId), userId: req.user._id });

      req.flash("success", "Item deleted from your closet!");
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting item" });
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
  // Suggest outfits based on weather
  suggestOutfits: async (req, res, db) => {
    try {
      let location = null;
      let weather = null;
        location = await geoLocationservice.getLatLon(); 
      if (location) {
        weather = await weatherService.getWeatherByLocation(
          location.lat,
          location.lon
        );
      }
      const applicableSeasons = getSeason(parseInt(weather.temperature)); // Get seasons based on temperature

      // Fetch clothing items from the database for the applicable seasons
      const clothes = await db
        .collection("clothingitems")
        .find({ season: { $in: applicableSeasons }, userId: req.user._id })
        .toArray();

        if (!clothes || clothes.length === 0) {
          console.log("No clothes found for the applicable seasons:", applicableSeasons);
          // If no clothes are available, return an empty outfit
          return [];
        }  

        console.log(clothes);

      // Categorize clothing items
      const tops = clothes.filter(
        (item) =>
          item.category === "Short Sleeve Top"||
          item.category === "Long Sleeve Top"
      );
      const bottoms = clothes.filter(
        (item) =>
          item.category === "Short Bottom" || item.category === "Long Bottom"
      );
      const onePieces = clothes.filter((item) => item.category === "Onepiece");
      const sets = clothes.filter((item) => item.category === "Set");
      const shoes = clothes.filter((item) => item.category === "Shoe");
      const headpiece = clothes.filter((item) => item.category === "Headpiece");
      const accessories = clothes.filter(
        (item) => item.category === "Accessory"
      );
      const outerwear = clothes.filter((item) => item.category === "Outerwear");

      // Create a random outfit
    const outfit = [];

      // Randomly choose between the two options
      const chooseCombination = Math.random() < 0.5; // 50% chance to choose combination or one-piece/set
  
      if (chooseCombination) {
        // Add headpiece
      if (headpiece.length) {
        outfit.push(headpiece[Math.floor(Math.random() * headpiece.length)]);
      }
      
        // Choose one top and one bottom
        if (tops.length > 0 && bottoms.length > 0) {
          const randomTop = tops[Math.floor(Math.random() * tops.length)];
          const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
          outfit.push(randomTop, randomBottom);
        }
      } else {
        // Choose one one-piece or set
        if (onePieces.length > 0 && sets.length > 0) {
          // Randomly choose between one-piece and set
          const chooseOnePiece = Math.random() < 0.5;
          if (chooseOnePiece) {
            outfit.push(onePieces[Math.floor(Math.random() * onePieces.length)]);
          } else {
            outfit.push(sets[Math.floor(Math.random() * sets.length)]);
          }
        } else if (onePieces.length > 0) {
          outfit.push(onePieces[Math.floor(Math.random() * onePieces.length)]);
        } else if (sets.length > 0) {
          outfit.push(sets[Math.floor(Math.random() * sets.length)]);
        }
      }
      

      // Add shoes
      if (shoes.length) {
        outfit.push(shoes[Math.floor(Math.random() * shoes.length)]);
      }


      // Add accessories
      if (accessories.length) {
        outfit.push(
          accessories[Math.floor(Math.random() * accessories.length)]
        );
      }

      // Add outerwear for Fall/Winter
      if (
        (applicableSeasons.includes("Winter") || applicableSeasons.includes("Fall")) &&
        outerwear.length
      ) {
        outfit.push(outerwear[Math.floor(Math.random() * outerwear.length)]);
      }
      return outfit.length ? outfit : [];
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error getting suggestions" });
    }
  },
  //Render outfit.ejs
  getOutfitPage: async (req, res, db) => {
    try {
      // Fetch outfit suggestions based on weather
      const outfits = await suggestOutfits(req, res, db); // Call the suggestOutfits function

      // Render the outfit page with weather data
      res.render("outfit.ejs", {
        user: req.user,
        weather: weather,
        outfits: outfits,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading outfit page");
    }
  },
  getFavoriteOutfits: async (req, res) => {
    try {
        const favoriteOutfits = await FavoriteOutfit.find({ userId: req.user._id });
        res.render('fave.ejs', { user: req.user, favoriteOutfits });
    } catch (err) {
        console.error('Error fetching favorite outfits:', err);
        res.status(500).send('Error loading favorite outfits');
    }
},

  // Save a favorite outfit
  saveFavoriteOutfit: async (req, res) => {
    try {
      const { outfit } = req.body; 
      console.log(outfit)
      if (!outfit || !Array.isArray(outfit) || outfit.length === 0) {
        return res.status(400).json({ error: 'Invalid outfit data' });
    }
      const favoriteOutfit = new FavoriteOutfit({
        userId: req.user._id,
        outfit
      });
      await favoriteOutfit.save();
      res.status(200).json({ message: 'Outfit saved to favorites!' });
    } catch (err) {
      console.error('Error saving favorite outfit:', err);
      res.status(500).json({ error: 'Unable to save favorite outfit' });
    }
  },
};
