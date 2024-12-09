const path = require("path");
const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");
const clothingItem = require("../app/models/clothingItem");
const GeoLocationService = require("../services/geoLocationservice");
const WeatherService = require("../services/weatherService");

    // Helper function to determine season
const getSeason = (temperature) => {
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
}

module.exports = {
    getSeason,
};
