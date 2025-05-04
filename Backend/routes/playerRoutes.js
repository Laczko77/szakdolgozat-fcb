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

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/players/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);

// Admin-only
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createPlayer);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updatePlayer);
router.delete('/:id', authenticateToken, requireAdmin, deletePlayer);

module.exports = router;
