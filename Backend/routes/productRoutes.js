const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');





const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Új termék létrehozása
router.post('/', upload.single('image'), productController.createProduct);
// Összes termék lekérése
router.get('/', productController.getAllProducts);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);

module.exports = router;
