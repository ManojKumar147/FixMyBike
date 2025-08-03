const Checkout = require('../model/checkout_model');

// Create a new checkout entry
exports.createCheckout = async (req, res) => {
    try {
        const { userId, shopOwnerId, trackingId, totalAmount, paymentType, walletType, bankName, transactionId, cartItems } = req.body;

        // Validate Payment Type
        if (paymentType === 'Digital Wallet' && !walletType) {
            return res.status(400).json({ error: 'Wallet type is required for Digital Wallet payments.' });
        }
        if (paymentType === 'Bank Account' && !bankName) {
            return res.status(400).json({ error: 'Bank name is required for Bank Account payments.' });
        }

        const checkout = new Checkout({
            userId,
            shopOwnerId,
            trackingId,
            totalAmount,
            paymentType,
            walletType: paymentType === 'Digital Wallet' ? walletType : undefined,
            bankName: paymentType === 'Bank Account' ? bankName : undefined,
            transactionId,
            cartItems
        });

        await checkout.save();
        res.status(201).json({ message: 'Checkout created successfully', checkout });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCheckOutsToAdmin = async (req, res, next) => {
    try {
      const checkouts = await Checkout.find()
        .populate('userId', 'full_name')
        .populate('shopOwnerId', 'full_name');
  
      if (!checkouts.length) {
        return next(new HttpError('No checkouts found.', 404));
      }
  
      res.status(200).json({ checkouts });
    } catch (error) {
      console.log('Error getting checkouts:', error);
      return next(new HttpError('Fetching checkouts failed, please try again later.', 500));
    }
  };

// Get all checkout records
exports.getAllCheckoutsOfSpecificShop = async (req, res) => {
    console.log(req.userId);
    console.log('in controller get all checkouts');
    const shopOwnerId = req.userId;
    try {
        const checkouts = await Checkout.find({shopOwnerId})
        .populate('userId', 'full_name')
        .populate('shopOwnerId', 'full_name');

        console.log('in controller',checkouts);
        res.status(200).json(checkouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single checkout by ID
exports.getCheckoutById = async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id).populate('userId shopOwnerId cartItems.productId');

        if (!checkout) {
            return res.status(404).json({ error: 'Checkout not found' });
        }

        res.status(200).json(checkout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a checkout record
exports.deleteCheckout = async (req, res) => {
    try {
        const checkout = await Checkout.findByIdAndDelete(req.params.id);

        if (!checkout) {
            return res.status(404).json({ error: 'Checkout not found' });
        }

        res.status(200).json({ message: 'Checkout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
