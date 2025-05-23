const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');
const { cloudinary } = require('../services/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Ez most a Cloudinary-ban létrejövő mappa neve lesz!
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => Date.now().toString(),
  },
});
const upload = multer({ storage });

// Publikus
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById); 

// Admin-only
router.post('/', authenticateToken, requireAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;
