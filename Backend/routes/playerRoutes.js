const express = require('express');
const router = express.Router();
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController');
const authMiddleware = require('../middlewares/authMiddleware');

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
router.post('/', authMiddleware, upload.single('image'), createPlayer);
router.put('/:id', authMiddleware, upload.single('image'), updatePlayer);

router.delete('/:id', authMiddleware, deletePlayer);

module.exports = router;
