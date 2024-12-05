const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  image: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    enum: ['Short sleeve top','Long sleeve top', 'Long bottom','Short bottom','Dress', 'Outerwear', 'Shoe','Headpiece', 'Accessory'],
    required: true,
  },
  season: {
    type: String,
    enum: ['Spring','Spring and Summer', 'Summer','Summer and Fall', 'Fall','Fall and Winter', 'Winter','Winter and Spring','All seasons'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);