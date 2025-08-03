const Shop = require('../model/shop_location_model');

// Get Shop Coordinates
exports.getShopCoordinates = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ latitude: shop.latitude, longitude: shop.longitude });
  } catch (error) {
    console.error('Error fetching shop coordinates:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add or Update Shop Coordinates
exports.updateShopCoordinates = async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      const userId = req.user.id; // Get the logged-in user's ID
  
      // Check if latitude and longitude are provided
      if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
      }
  
      // Try to find an existing shop for the user
      let shop = await Shop.findOne({ owner: userId });
  
      // If no shop is found, create a new one
      if (!shop) {
        shop = new Shop({
          owner: userId, // Set the logged-in user as the owner
          latitude,
          longitude,
        });
        await shop.save();
        return res.status(201).json({
          message: 'Shop created with coordinates.',
          shop,
        });
      }
  
      // If the shop is found, update the coordinates
      shop.latitude = latitude;
      shop.longitude = longitude;
  
      await shop.save();
  
      return res.status(200).json({
        message: 'Shop coordinates updated successfully.',
        shop,
      });
    } catch (error) {
      console.error('Error updating or creating shop coordinates:', error);
      return res.status(500).json({ message: 'Server error while updating shop coordinates.' });
    }
  };
  
  