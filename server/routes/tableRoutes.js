const express = require('express');
const router = express.Router();
const {
    getTables,
    createTable,
    updateTableStatus,
    updateTable,
    deleteTable,
    getTableById
} = require('../controllers/tableController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/public/:id', getTableById);

router.route('/')
    .get(protect, getTables)
    .post(protect, isAdmin, createTable);

router.route('/:id')
    .put(protect, isAdmin, updateTable)
    .delete(protect, isAdmin, deleteTable);

router.route('/:id/status')
    .patch(protect, updateTableStatus);

module.exports = router;
