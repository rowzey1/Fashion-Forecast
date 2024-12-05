const express = require('express');
const wardrobeRoutes = require('./routes/wardrobeRoutes');
const routes = require('./routes/routes');
const WeatherService = require('./services/WeatherService'); 

const app = express();

app.use('/', routes);
app.use('/wardrobe', wardrobeRoutes); 