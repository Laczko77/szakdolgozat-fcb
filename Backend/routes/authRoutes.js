const express = require('express');
// Az Express könyvtár importálása, amely a route-ok kezeléséhez szükséges.

const userController = require('../controllers/userController');
// A `userController` importálása, amely a regisztráció és bejelentkezés logikáját tartalmazza.

const router = express.Router();
// Egy új router objektum létrehozása az Express segítségével.

// Regisztrációs útvonal
router.post('/register', userController.register);
// POST kérés a `/register` végponthoz. Meghívja a `userController` `register` metódusát,
// amely kezeli a felhasználó regisztrációját.

// Bejelentkezési útvonal
router.post('/login', userController.login);
// POST kérés a `/login` végponthoz. Meghívja a `userController` `login` metódusát,
// amely kezeli a felhasználó bejelentkezését.
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
  });

module.exports = router;
// A router exportálása, hogy a fő alkalmazásfájl (pl. `app.js`) importálhassa és használhassa.
