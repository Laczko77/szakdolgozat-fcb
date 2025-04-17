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

router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.post('/', authMiddleware, createPlayer);
router.put('/:id', authMiddleware, updatePlayer);
router.delete('/:id', authMiddleware, deletePlayer);

module.exports = router;
