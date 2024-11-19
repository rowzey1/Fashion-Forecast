
const fs = require('fs');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;
const multer= require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = 'public/uploads/wardrobe';
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
    
});



// normal routes ===============================================================

module.exports = function(app, passport, db) {

    // normal routes ===============================================================
    
    // HOME PAGE (with login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION
    app.get('/profile', isLoggedIn, async function(req, res) {
        try {
            const clothingCount = await db.collection('clothes').countDocuments({ userId: req.user._id });
            const outfitCount = await db.collection('outfits').countDocuments({ userId: req.user._id });
            
            res.render('profile.ejs', {
                user: req.user,
                clothingCount: clothingCount,
                outfitCount: outfitCount
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error loading profile');
        }
    });

    // LOGOUT
    app.get('/logout', function(req, res) {
        req.logout(() => {
            console.log('User has logged out!')
        });
        res.redirect('/');
    });

    // WARDROBE ROUTES ===============================================================
    
    app.post('/wardrobe/add', isLoggedIn, upload.single('image'), async (req, res) => {
        try {
            const clothingItem = {
                userId: req.user._id,
                image: req.file.filename,
                description: req.body.description || '',
                category: req.body.category || 'Uncategorized',
                createdAt: new Date()
            };
    
            await db.collection('clothes').insertOne(clothingItem);
            req.flash('success', 'Item added to your closet!');
            res.redirect('/wardrobe');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error adding clothing item');
        }
    });

    app.get('/wardrobe', isLoggedIn, async (req, res) => {
        try {
            const clothes = await db.collection('clothes')
                .find({ userId: req.user._id })
                .sort({ createdAt: -1 })
                .toArray();
    
            res.render('wardrobe.ejs', {
                user: req.user,
                clothes: clothes,
                messages: {
                    success: req.flash('success'),
                    error: req.flash('error')
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error loading wardrobe');
        }
    });
    
    app.get('/outfits/suggest', isLoggedIn, async (req, res) => {
        try {
            const { temperature, conditions } = req.query;
            const suggestions = await db.collection('clothes')
                .find({
                    userId: req.user._id,
                    season: getSeason(temperature)
                })
                .toArray();
            
            res.json(suggestions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error getting suggestions' });
        }
    });

    // AUTHENTICATION ROUTES ===============================================================
    
    // LOGIN
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // SIGNUP
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // UNLINK ACCOUNT
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        let user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.local.username = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // Helper function for season determination
    function getSeason(temperature) {
        if (temperature < 45) return 'winter';
        if (temperature < 65) return 'spring';
        if (temperature < 85) return 'summer';
        return 'fall';
    }

    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
};

