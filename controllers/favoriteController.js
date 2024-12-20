const FavoriteOutfit = require('../app/models/favoriteItem');

module.exports = {
    // Save a favorite outfit
  saveFavoriteOutfit: async (req, res) => {
    try {
      const { outfit } = req.body; 
      console.log(outfit)
      if (!outfit || !Array.isArray(outfit) || outfit.length === 0) {
        return res.status(400).json({ error: 'Invalid outfit data' });
    }
      const favoriteOutfit = new FavoriteOutfit({
        userId: req.user._id,
        outfit
      });
      await favoriteOutfit.save();
      res.status(200).json({ message: 'Outfit saved to favorites!' });
    } catch (err) {
      console.error('Error saving favorite outfit:', err);
      res.status(500).json({ error: 'Unable to save favorite outfit' });
    }
  },
    getFavoriteOutfits: async (req, res) => {
        try {
            const favoriteOutfits = await FavoriteOutfit.find({ userId: req.user._id });
            res.render('fave.ejs', { user: req.user, favoriteOutfits });
        } catch (err) {
            console.error('Error fetching favorite outfits:', err);
            res.status(500).send('Error loading favorite outfits');
        }
    },
    // delete a favorite outfit
  deleteFavoriteOutfit: async (req, res) => {
    try {
      const outfitId = req.params.id;
      const result = await FavoriteOutfit.deleteOne({ _id: outfitId, userId: req.user._id });
      
      if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Outfit not found' });
      }

      res.status(200).json({ success: true });
  } catch (err) {
      console.error('Error deleting favorite outfit:', err);
      res.status(500).json({ success: false, error: 'Unable to delete favorite outfit' });
  }
},
    
};