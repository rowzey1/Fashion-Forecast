const express = require('express');
const { addClothingItem, getWardrobe, suggestOutfits, deleteClothingItem,suggestOutfits,
    getOutfitPage, } = require('../controllers/clothingController');
const isLoggedIn = require('../Fashion-Forecast/middleware/auth'); 
const GeoLocationService = require("../services/geoLocationservice");
const WeatherService = require("../services/weatherService");
const upload = require('../middleware/multer');
const router = express.Router();


// Wardrobe routes
router.post('/add', isLoggedIn, upload.single('image'), addClothingItem);
router.get('/', isLoggedIn, getWardrobe);
router.get('/suggest', isLoggedIn, suggestOutfits);
router.delete('/wardrobe/delete/:id', isLoggedIn, deleteClothingItem);
router.get('/outfits/suggest', isLoggedIn, suggestOutfits);

module.exports = router;