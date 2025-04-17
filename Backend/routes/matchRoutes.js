const express = require('express');
const router = express.Router();
const {
  getAllMatches,
  createMatch,
  updateMatch,
  deleteMatch
} = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllMatches);
router.post('/', authMiddleware, createMatch);
router.put('/:id', authMiddleware, updateMatch);
router.delete('/:id', authMiddleware, deleteMatch);

module.exports = router;
