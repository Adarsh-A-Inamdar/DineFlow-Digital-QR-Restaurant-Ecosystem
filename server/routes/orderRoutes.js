const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrderById,
    getOrders,
    updateOrderStatus,
    generateInvoicePDF,
    getAnalytics
} = require('../controllers/orderController');
const { protect, verifyFirebaseToken } = require('../middleware/authMiddleware');

router.route('/analytics').get(protect, getAnalytics);

router.route('/')
    .get(protect, getOrders)
    .post(placeOrder); 

router.route('/:id').get(getOrderById);
router.route('/:id/status').patch(protect, updateOrderStatus);
router.route('/:id/invoice').get(generateInvoicePDF);

module.exports = router;
