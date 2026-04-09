const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({});
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a menu item
// @route   POST /api/menu
// @access  Admin
const createMenuItem = async (req, res) => {
    try {
        const { name, price, category, description, imageUrl, enableTimer, preparationTime } = req.body;
        const menuItem = new MenuItem({
            name, price, category, description, imageUrl, enableTimer, preparationTime
        });
        const createdItem = await menuItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Admin
const updateMenuItem = async (req, res) => {
    try {
        const { name, price, category, description, imageUrl, isAvailable, enableTimer, preparationTime } = req.body;
        const menuItem = await MenuItem.findById(req.params.id);

        if (menuItem) {
            menuItem.name = name || menuItem.name;
            menuItem.price = price !== undefined ? price : menuItem.price;
            menuItem.category = category || menuItem.category;
            menuItem.description = description || menuItem.description;
            menuItem.imageUrl = imageUrl || menuItem.imageUrl;
            menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;
            menuItem.enableTimer = enableTimer !== undefined ? enableTimer : menuItem.enableTimer;
            menuItem.preparationTime = preparationTime !== undefined ? preparationTime : menuItem.preparationTime;

            const updatedItem = await menuItem.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Admin
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (menuItem) {
            await MenuItem.deleteOne({ _id: req.params.id });
            res.json({ message: 'Menu item removed' });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
};
