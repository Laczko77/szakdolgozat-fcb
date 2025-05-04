const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const forumController = require('../controllers/forumController');


// képfeltöltés konfiguráció
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/forum/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// csak bejelentkezett felhasználók használhatják ezeket
router.post('/', authenticateToken, upload.single('image'), forumController.createForumPost);
router.get('/', authenticateToken, forumController.getAllForumPosts);
router.delete('/:id', authenticateToken, forumController.deleteForumPost);
router.put('/:id', authenticateToken, upload.single('image'), forumController.updateForumPost);
router.post('/:id/like', authenticateToken, forumController.likeForumPost);
router.post('/:id/comment', authenticateToken, forumController.addComment);
router.put('/:id/comment', authenticateToken, forumController.updateComment);
router.delete('/:id/comment', authenticateToken, forumController.deleteComment);


module.exports = router;
