const express = require('express');
const router = express.Router();
const {
  getAllMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  getUpcomingMatches
} = require('../controllers/matchController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAllMatches);
router.get('/upcoming', getUpcomingMatches);

// Admin-only
router.post('/', authenticateToken, requireAdmin, createMatch);
router.put('/:id', authenticateToken, requireAdmin, updateMatch);
router.delete('/:id', authenticateToken, requireAdmin, deleteMatch);

module.exports = router;
