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
    enum: ['Short Sleeve Top','Long Sleeve Top', 'Long Bottom','Short Bottom','Onepiece','Set', 'Outerwear', 'Shoe','Headpiece', 'Accessory'],
    required: true,
  },
  season: {
    type: [String],
    enum: ['Spring', 'Summer', 'Fall', 'Winter'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);