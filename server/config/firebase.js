const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const initializeFirebase = () => {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(path.resolve(serviceAccountPath));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin Initialized');
    } else {
        console.warn('Firebase Service Account not found. Firebase Auth will not work until configured.');
    }
};

module.exports = initializeFirebase;
