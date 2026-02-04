const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const {verifyToken, adminOnly} = require('../middleware/auth.middleware');
const { verify } = require('jsonwebtoken');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', verifyToken, adminOnly, categoryController.createCategory);
router.put('/:id', verifyToken, adminOnly, categoryController.updateCategory);
router.delete('/:id', verifyToken, adminOnly, categoryController.deleteCategory);

module.exports = router;