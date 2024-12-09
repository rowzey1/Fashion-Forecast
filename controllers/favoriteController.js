const FavoriteOutfit = require('../app/models/favoriteItem');

module.exports = {
    getFavoriteOutfits: async (req, res) => {
        try {
            const favoriteOutfits = await FavoriteOutfit.find({ userId: req.user._id });
            res.render('fave.ejs', { user: req.user, favoriteOutfits });
        } catch (err) {
            console.error('Error fetching favorite outfits:', err);
            res.status(500).send('Error loading favorite outfits');
        }
    }
};