const axios = require('axios');

class GeoLocationService {
    constructor() {
        this.baseUrl = 'http://ip-api.com/json/'; // IP-API endpoint
    }

    async getLatLon(ip = '') {
        try {
            const url = `${this.baseUrl}${ip}`;
            const response = await axios.get(url);
            if (response.data.status === 'fail') {
                throw new Error(response.data.message || 'Unable to fetch location');
            }

            return {
                lat: response.data.lat,
                lon: response.data.lon
            };
        } catch (error) {
            console.error('Geolocation API Error:', error.message);
            throw new Error('Unable to fetch geolocation data');
        }
    }
}

module.exports = new GeoLocationService();
