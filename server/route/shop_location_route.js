const express = require('express');
const { getShopCoordinates, updateShopCoordinates } = require('../controller/shop_location_controller');
const authMiddleware = require('../middleware/authMiddleware/authMiddleware'); 

const router = express.Router();

// Route to get shop coordinates
router.get('/get-coordinates', authMiddleware, getShopCoordinates);

// Route to update shop coordinates
router.put('/set-coordinates', authMiddleware, updateShopCoordinates);

module.exports = router;
