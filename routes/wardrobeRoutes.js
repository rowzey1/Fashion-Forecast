const express = require('express');
const { addClothingItem, getWardrobe, suggestOutfits } = require('../controllers/clothingController');
const isLoggedIn = require('../Fashion-Forecast/middleware/auth'); 
const multer = require('multer');

const router = express.Router();

// Multer setup for file uploads
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

// Wardrobe routes
router.post('/add', isLoggedIn, upload.single('image'), addClothingItem);
router.get('/', isLoggedIn, getWardrobe);
router.get('/suggest', isLoggedIn, suggestOutfits);

module.exports = router;