const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/news/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
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
