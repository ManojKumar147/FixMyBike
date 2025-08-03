const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const checkoutController = require('../controller/checkout_controller');

router.post('/checkout/create', authMiddleware, checkoutController.createCheckout);
router.get('/checkout/get-checkouts-data', authMiddleware, checkoutController.getAllCheckoutsOfSpecificShop);
router.get('/admin/get-checkouts', authMiddleware,checkoutController.getCheckOutsToAdmin)
router.get('/checkout/:id', checkoutController.getCheckoutById);
router.delete('/checkout/:id', checkoutController.deleteCheckout);

module.exports = router;
