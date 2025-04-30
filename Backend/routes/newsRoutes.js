const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authenticateToken = require('../middlewares/authMiddleware');
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

// Hírek lekérése (publikus)
router.get('/', newsController.getAllNews);

// Új hír létrehozása (csak bejelentkezett felhasználóknak/adminnak)
router.post('/', upload.single('image'), newsController.createNews);

// Hír törlése (csak bejelentkezett felhasználóknak/adminnak)
router.delete('/:id', newsController.deleteNews);

router.get('/:id', newsController.getNewsById);

router.put('/:id', upload.single('image'), newsController.updateNews);



module.exports = router;
