const express = require('express');
const wardrobeRoutes = require('./routes/wardrobeRoutes');

const app = express();

app.use('/wardrobe', wardrobeRoutes); 