const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    product_image: { type: String, required: true },
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    shopOwnerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    trackingId: { type: String, required: true }
});

const CheckoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    shopOwnerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    trackingId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentType: { type: String, required: true, enum: ['Bank Account', 'Digital Wallet'] },
    
    // For Digital Wallet
    walletType: { 
        type: String, 
        required: function () { return this.paymentType === 'Digital Wallet'; },
        enum: ['JazzCash', 'EasyPaisa', 'UfonePay'],
    },

    // For Bank Account
    bankName: { 
        type: String, 
        required: function () { return this.paymentType === 'Bank Account'; } 
    },

    transactionId: { type: String, required: true },

    cartItems: { type: [CartItemSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Checkout', CheckoutSchema);
