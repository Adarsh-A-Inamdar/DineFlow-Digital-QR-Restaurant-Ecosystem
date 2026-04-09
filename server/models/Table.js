const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Free', 'Occupied', 'Reserved'],
        default: 'Free'
    },
    qrCode: {
        type: String
    },
    currentSession: {
        phoneNumber: String,
        startTime: Date,
        firebaseUid: String
    },
    capacity: {
        type: Number,
        default: 2
    }
}, {
    timestamps: true
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
