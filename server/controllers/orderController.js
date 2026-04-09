const Order = require('../models/Order');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Customer
const placeOrder = async (req, res) => {
    try {
        const { tableId, items, totalAmount, phoneNumber } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            table: tableId,
            phoneNumber,
            items,
            totalAmount
        });

        const createdOrder = await order.save();
        
        // Populate for real-time broadcast
        const populatedOrder = await Order.findById(createdOrder._id)
            .populate('table', 'tableNumber')
            .populate('items.menuItem', 'name');

        // Real-time broadcast
        const io = req.app.get('socketio');
        io.to('kitchen').emit('NEW_ORDER', populatedOrder);
        
        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (for tracker)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('table', 'tableNumber')
            .populate('items.menuItem', 'name');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (for Kitchen/Admin)
// @route   GET /api/orders
// @access  Staff/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('table', 'tableNumber')
            .populate('items.menuItem', 'name price category')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Staff/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            await order.save();

            // If order is Paid, free up the table
            if (status === 'Paid' || status === 'Cancelled') {
                const Table = require('../models/Table');
                await Table.findByIdAndUpdate(order.table, { status: 'Free' });
            }
            
            const updatedOrder = await Order.findById(order._id)
                .populate('table', 'tableNumber')
                .populate('items.menuItem', 'name');

            // Real-time broadcast to the specific table room
            const io = req.app.get('socketio');
            io.to(`table_${order.table._id || order.table}`).emit('STATUS_UPDATE', updatedOrder);
            
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const { generateInvoice } = require('../utils/pdfGenerator');

// @desc    Generate invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Public (or protected)
const generateInvoicePDF = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.menuItem');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
        
        generateInvoice(order, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get admin analytics
// @route   GET /api/orders/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
    try {
        const orders = await Order.find({});
        const tables = await require('../models/Table').find({});

        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalOrders = orders.length;
        const activeTables = tables.filter(t => t.status === 'Occupied').length;

        // Calculate popular dish
        const itemCounts = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const menuItemId = item.menuItem.toString();
                itemCounts[menuItemId] = (itemCounts[menuItemId] || 0) + item.quantity;
            });
        });

        let popularDish = 'None';
        let maxCount = 0;
        const MenuItem = require('../models/MenuItem');
        
        for (const [id, count] of Object.entries(itemCounts)) {
            if (count > maxCount) {
                maxCount = count;
                const dish = await MenuItem.findById(id);
                if (dish) popularDish = dish.name;
            }
        }

        res.json({
            totalSales,
            activeTables,
            totalOrders,
            popularDish,
            recentOrders: await Order.find().populate('table', 'tableNumber').sort({ createdAt: -1 }).limit(5)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    placeOrder,
    getOrderById,
    getOrders,
    updateOrderStatus,
    generateInvoicePDF,
    getAnalytics
};
