const GeoLocationService = require('../services/geoLocationservice');
const WeatherService = require('../services/weatherService');

module.exports = {
    getWeather: async (req, res) => {
        try {
            // Get the user's IP address
            const ip = req.ip; 
            const { lat, lon } = await GeoLocationService.getLatLon(ip);
            const weatherData = await WeatherService.getWeatherByLocation(lat, lon);
            res.json(weatherData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            res.status(500).json({ error: 'Unable to fetch weather data' });
        }
    }
};