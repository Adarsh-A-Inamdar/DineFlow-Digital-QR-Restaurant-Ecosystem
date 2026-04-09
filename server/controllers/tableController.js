const Table = require('../models/Table');
const QRCode = require('qrcode');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Staff/Admin
const getTables = async (req, res) => {
    try {
        const tables = await Table.find({});
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new table
// @route   POST /api/tables
// @access  Admin
const createTable = async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;
        const tableExist = await Table.findOne({ tableNumber });

        if (tableExist) {
            return res.status(400).json({ message: 'Table already exists' });
        }

        const table = new Table({ 
            tableNumber, 
            capacity
        });
        const createdTable = await table.save();

        // Generate QR Code with REAL _id
        const qrContent = `http://localhost:5173/?tableId=${createdTable._id}`;
        createdTable.qrCode = await QRCode.toDataURL(qrContent);
        await createdTable.save();

        res.status(201).json(createdTable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update table status
// @route   PATCH /api/tables/:id/status
// @access  Staff/Admin
const updateTableStatus = async (req, res) => {
    try {
        const { status, currentSession } = req.body;
        const table = await Table.findById(req.params.id);

        if (table) {
            table.status = status || table.status;
            if (currentSession) {
                table.currentSession = currentSession;
            } else if (status === 'Free') {
                table.currentSession = undefined;
            }

            const updatedTable = await table.save();
            res.json(updatedTable);
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if (table) {
            await Table.deleteOne({ _id: req.params.id });
            res.json({ message: 'Table removed' });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTable = async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;
        const table = await Table.findById(req.params.id);

        if (table) {
            // If table number changes, check if new number exists and regenerate QR
            if (tableNumber && tableNumber !== table.tableNumber) {
                const tableExist = await Table.findOne({ tableNumber });
                if (tableExist) {
                    return res.status(400).json({ message: 'Table number already exists' });
                }
                
                const qrContent = `http://localhost:5173/?tableId=${tableNumber}`;
                table.qrCode = await QRCode.toDataURL(qrContent);
                table.tableNumber = tableNumber;
            }

            table.capacity = capacity || table.capacity;

            const updatedTable = await table.save();
            res.json(updatedTable);
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get table by ID (Public)
const getTableById = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if (table) {
            res.json({
                _id: table._id,
                tableNumber: table.tableNumber,
                capacity: table.capacity,
                status: table.status
            });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid Table ID' });
    }
};

module.exports = {
    getTables,
    createTable,
    updateTableStatus,
    updateTable,
    deleteTable,
    getTableById
};
