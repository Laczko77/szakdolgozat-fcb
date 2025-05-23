const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');
const { cloudinary } = require('../services/cloudinary'); // vagy ahova raktad!
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer'); 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'news', // minden típusnál más lehet pl. 'players', 'products'
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => Date.now().toString(),
  },
});
const upload = multer({ storage });


// Publikus hírek lekérése
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Admin-only: létrehozás, módosítás, törlés
router.post('/', authenticateToken, requireAdmin, upload.single('image'), newsController.createNews);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), newsController.updateNews);
router.delete('/:id', authenticateToken, requireAdmin, newsController.deleteNews);

module.exports = router;
