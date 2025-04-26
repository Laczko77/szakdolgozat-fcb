const userService = require('../services/userService');
// Az userService modul importálása, amely tartalmazza a felhasználók regisztrációs és keresési logikáját.

const bcrypt = require('bcrypt');
// A bcrypt importálása jelszó-ellenőrzéshez.
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// A jsonwebtoken importálása, amely a felhasználói azonosításhoz szükséges.

const { OAuth2Client } = require('google-auth-library');
// A Google Identity Services könyvtár importálása a Google tokenek ellenőrzéséhez.
const client = new OAuth2Client('346108805116-bkqslvfiof5kl2odkqim4779lorqs5og.apps.googleusercontent.com');

// Felhasználó regisztrációs függvény (email/jelszó)
const register = async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: newUser 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Felhasználó bejelentkezési függvény (email/jelszó)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Google OAuth login függvény
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '346108805116-bkqslvfiof5kl2odkqim4779lorqs5og.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await userService.findUserByEmail(email);

    if (!user) {
      user = new User({
        username: name,
        email: email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random dummy jelszó
        role: 'user'
      });
      
      await user.save();
    }

    const tokenJWT = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Google login successful', 
      token: tokenJWT 
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

// Leaderboard (Top 5 user)
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

// Exportálás
module.exports = {
  register,
  login,
  googleLogin,
  getLeaderboard
};
