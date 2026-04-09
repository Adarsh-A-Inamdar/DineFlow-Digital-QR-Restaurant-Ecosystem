const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Paid', 'Cancelled'],
        default: 'Pending'
    },
    customizations: String
});

const orderSchema = new mongoose.Schema({
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Paid', 'Cancelled'],
        default: 'Pending'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentDetails: {
        method: String,
        transactionId: String,
        amountPaid: Number
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
