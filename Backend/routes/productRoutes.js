const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');
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

// Publikus
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only
router.post('/', authenticateToken, requireAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;
