const axios = require('axios');

class WeatherService {
    constructor() {
        this.apiKey = process.env.WEATHER_API_KEY; 
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getWeatherByLocation(lat, lon) {
        try {
            const response = await axios.get(`${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`);
            return {
                temperature: response.data.main.temp,
                condition: response.data.weather[0].main,
                description: response.data.weather[0].description
            };
        } catch (error) {
            console.error('Weather API Error:', error);
            throw new Error('Unable to fetch weather data');
        }
    }
}

module.exports = new WeatherService(); 