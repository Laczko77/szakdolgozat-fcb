const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

// Admin-only
router.post('/', authenticateToken, requireAdmin, pollController.createPoll);
router.patch('/:id/close', authenticateToken, requireAdmin, pollController.closePoll);
router.post('/:id/evaluate', authenticateToken, requireAdmin, pollController.evaluatePoll);
router.delete('/:id', authenticateToken, requireAdmin, pollController.deletePoll);

// Publikus (bejelentkezett) felhasználók
router.get('/', authenticateToken, pollController.getAllPolls);
router.post('/:id/vote', authenticateToken, pollController.votePoll);

module.exports = router;
