const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Új termék létrehozása
router.post('/', productController.createProduct);

// Összes termék lekérése
router.get('/', productController.getAllProducts);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
