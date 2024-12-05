require('dotenv').config({ path: './config/.env' });
const express  = require('express');
const app      = express();
const MongoClient = require('mongodb').MongoClient
const mongoURI = process.env.DB_STRING;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const path = require('path');

const configDB = require('./config/database.js');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
  
  
app.set('view engine', 'ejs'); // set up ejs for templating
  
  // required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// configuration ===============================================================
require('./config/passport')(passport); // pass passport for configuration

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(client => {
    console.log('Connected to MongoDB');
    
    // Get the database instance
    const db = mongoose.connection;

    require('./routes/routes.js')(app, passport, db);
    
    // Start the server after DB connection
    app.listen(process.env.PORT, () => {
        console.log('The server is running on port ' + process.env.PORT);
    });
})
.catch(error => {
    console.error('Database Connection Error:', error);
    process.exit(1); // Exit if unable to connect to database
});


const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Add after your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: err.message || 'Internal Server Error'
    });
});