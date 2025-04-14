const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer token"

  if (!token) return res.status(401).json({ message: 'Nincs token!' });

  try {
    const decoded = jwt.verify(token, 'secretkey');; // ugyanaz, mint a loginban
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) return res.status(404).json({ message: 'Felhasználó nem található!' });

    req.user = user; // továbbadjuk a user-t
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Érvénytelen token!' });
  }
};

module.exports = authenticateToken;
