const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const forumController = require('../controllers/forumController');
const { cloudinary } = require('../services/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


// képfeltöltés konfiguráció
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'forum',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => Date.now().toString(),
  },
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
