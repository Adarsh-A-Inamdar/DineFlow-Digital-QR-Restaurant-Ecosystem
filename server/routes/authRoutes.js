const express = require('express');
const router = express.Router();
const {
    loginUser,
    verifyFirebase,
    registerUser
} = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/verify-firebase', verifyFirebase);
router.post('/register', registerUser);

module.exports = router;
