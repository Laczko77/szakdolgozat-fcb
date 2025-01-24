const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Regisztrációs route
router.post('/register', userController.register);

// Bejelentkezési route
router.post('/login', userController.login);

module.exports = router;
