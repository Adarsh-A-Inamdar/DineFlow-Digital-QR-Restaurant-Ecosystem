const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    enableTimer: {
        type: Boolean,
        default: false
    },
    preparationTime: {
        type: Number,
        default: 0 // in minutes
    }
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
