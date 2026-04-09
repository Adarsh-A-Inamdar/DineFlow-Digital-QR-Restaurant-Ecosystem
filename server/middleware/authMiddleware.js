const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const User = require('../models/User');

// Middleware to verify Firebase ID Token (for Customers)
const verifyFirebaseToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                phoneNumber: decodedToken.phone_number,
                role: 'Customer'
            };
            next();
        } catch (error) {
            console.error('Firebase Token Error:', error);
            res.status(401);
            throw new Error('Not authorized, Firebase token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};

// Middleware to verify Admin/Staff JWT
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('JWT Error:', error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};

// Middleware for Admin role only
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { verifyFirebaseToken, protect, isAdmin };
