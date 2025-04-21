const userService = require('../services/userService');
// Az userService modul importálása, amely tartalmazza a felhasználók regisztrációs és keresési logikáját.

const bcrypt = require('bcrypt');
// A bcrypt importálása jelszó-ellenőrzéshez.
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// A jsonwebtoken importálása, amely a felhasználói azonosításhoz használt JWT-k generálásához szükséges.

// Felhasználó regisztrációs függvény
const register = async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);
    // Az userService `registerUser` függvényének meghívása a kéréstörzsben kapott adatokkal.

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: newUser 
    });
    // 201-es státusz: A felhasználó sikeresen létrehozva, és az új felhasználó adatait visszaküldjük.
  } catch (error) {
    res.status(400).json({ error: error.message });
    // 400-as státusz: Hibás kérés esetén hibaüzenet visszaadása.
  }
};

// Felhasználó bejelentkezési függvény
const login = async (req, res) => {
  const { email, password } = req.body;
  // A kéréstörzsből kinyerjük az emailt és jelszót.

  try {
    const user = await userService.findUserByEmail(email);
    // Az email alapján keresünk egy felhasználót az adatbázisban.

    if (!user) {
      // Ha nem található a felhasználó, hibás hitelesítési üzenetet küldünk.
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // A megadott jelszót összehasonlítjuk az adatbázisban tárolt hash-elt jelszóval.

    if (!isMatch) {
      // Ha a jelszó nem egyezik, hibás hitelesítési üzenetet küldünk.
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role  // 💡 most már ezt is tartalmazza
      },
      'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      token 
    });
    // Sikeres bejelentkezés esetén visszaküldjük a JWT-t.
  } catch (err) {
    console.error(err);
    // Hibák logolása konzolra.

    res.status(500).json({ message: 'Internal server error' });
    // 500-as státusz: Általános szerverhiba esetén hibaüzenet visszaadása.
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({}, 'username score')
      .sort({ score: -1 })
      .limit(5);

    res.json(topUsers);
  } catch (err) {
    console.error('Hiba a leaderboard lekérdezésekor:', err);
    res.status(500).json({ error: 'Nem sikerült lekérni a toplistát.' });
  }
};

module.exports = {
  register,
  login,
  getLeaderboard
};
// A regisztrációs és bejelentkezési függvények exportálása, hogy a routerekben használhatóak legyenek.
