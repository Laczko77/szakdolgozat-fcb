const express = require('express');
const router = express.Router();
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

const { cloudinary } = require('../services/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'players', // Cloudinary-n ebbe a mappába mennek a képek
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => Date.now().toString(),
  },
});
const upload = multer({ storage });

router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);

// Admin-only
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createPlayer);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updatePlayer);
router.delete('/:id', authenticateToken, requireAdmin, deletePlayer);

module.exports = router;
