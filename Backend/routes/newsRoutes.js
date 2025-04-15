const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authenticateToken = require('../middlewares/authMiddleware');

// Hírek lekérése (publikus)
router.get('/', newsController.getAllNews);

// Új hír létrehozása (csak bejelentkezett felhasználóknak/adminnak)
router.post('/', authenticateToken, newsController.createNews);

// Hír törlése (csak bejelentkezett felhasználóknak/adminnak)
router.delete('/:id', authenticateToken, newsController.deleteNews);

module.exports = router;
