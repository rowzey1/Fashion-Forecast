
const fs = require('fs');
const path = require('path');
const { addClothingItem, getWardrobe, suggestOutfits } = require("../controllers/clothingController");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });





// normal routes ===============================================================

module.exports = function (app, passport, db) {
    // Home page
    app.get('/', (req, res) => {
      res.render('index.ejs');
    });
  
    // Profile section
    app.get('/profile', isLoggedIn, async (req, res) => {
      try {
        const clothingCount = await db.collection('clothes').countDocuments({ userId: req.user._id });
        const outfitCount = await db.collection('outfits').countDocuments({ userId: req.user._id });
  
        res.render('profile.ejs', {
          user: req.user,
          clothingCount,
          outfitCount
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error loading profile');
      }
    });
  
    // Logout
    app.get('/logout', (req, res) => {
      req.logout(() => {
        console.log('User has logged out!');
      });
      res.redirect('/');
    });
  
    // Wardrobe routes
    app.post('/wardrobe/add', isLoggedIn, upload.single('image'), (req, res) => {
      addClothingItem(req, res, db);
    });
  
    app.get('/wardrobe', isLoggedIn, (req, res) => {
      getWardrobe(req, res, db);
    });
  
    app.get('/outfits/suggest', isLoggedIn, (req, res) => {
      suggestOutfits(req, res, db);
    });
  
    // Authentication routes
    app.get('/login', (req, res) => {
      res.render('login.ejs', { message: req.flash('loginMessage') });
    });
  
    app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    }));
  
    app.get('/signup', (req, res) => {
      res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
  
    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
    }));
  
    app.get('/unlink/local', isLoggedIn, (req, res) => {
      const user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.local.username = undefined;
      user.save((err) => {
        res.redirect('/profile');
      });
    });
  
    // Middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/');
    }
};