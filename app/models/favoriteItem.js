const mongoose = require("mongoose");



const favoriteOutfitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  outfit: [
    {
      image: String,
      category: String,
      season: String,
    },
  ],
});


/*
const favoriteOutfitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    enum: [
      "Short Sleeve Top",
      "Long Sleeve Top",
      "Long Bottom",
      "Short Bottom",
      "Onepiece",
      "Set",
      "Outerwear",
      "Shoe",
      "Headpiece",
      "Accessory",
    ],
    required: true,
  },
  season: {
    type: [String],
    enum: ["Spring", "Summer", "Fall", "Winter"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
*/

module.exports = mongoose.model("FavoriteOutfit", favoriteOutfitSchema);
