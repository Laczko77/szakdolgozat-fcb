const express = require('express');
const { register, login, getLeaderboard, googleLogin } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin); // <-- EZ az új!
router.get('/leaderboard', getLeaderboard);
router.get('/profile', authenticateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
