const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authenticateToken = require('../middlewares/authMiddleware');

// Hírek lekérése (publikus)
router.get('/', newsController.getAllNews);

// Új hír létrehozása (csak bejelentkezett felhasználóknak/adminnak)
router.post('/',  newsController.createNews);

// Hír törlése (csak bejelentkezett felhasználóknak/adminnak)
router.delete('/:id', newsController.deleteNews);

router.get('/:id', newsController.getNewsById);

router.put('/:id', newsController.updateNews);



module.exports = router;
