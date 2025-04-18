const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const verifyToken = require('../middlewares/authMiddleware');
const multer = require('multer');

// képfeltöltés konfiguráció
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/forum/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// csak bejelentkezett felhasználók használhatják ezeket
router.post('/', verifyToken, upload.single('image'), forumController.createForumPost);
router.get('/', verifyToken, forumController.getAllForumPosts);
router.delete('/:id', verifyToken, forumController.deleteForumPost);

module.exports = router;
