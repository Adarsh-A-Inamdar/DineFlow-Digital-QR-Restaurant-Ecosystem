const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, isAdmin, createCategory);

router.route('/:id')
    .delete(protect, isAdmin, deleteCategory);

module.exports = router;
