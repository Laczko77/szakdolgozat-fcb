const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const verifyToken = require('../middlewares/authMiddleware');

// Új szavazás létrehozása (admin)
router.post('/', verifyToken, pollController.createPoll);

// Szavazás lezárása
router.patch('/:id/close', verifyToken, pollController.closePoll);

// Szavazás törlése
router.delete('/:id', verifyToken, pollController.deletePoll);
router.get('/', verifyToken, pollController.getAllPolls);
router.post('/:id/evaluate', verifyToken, pollController.evaluatePoll);
router.post('/:id/vote', verifyToken, pollController.votePoll);
module.exports = router;
