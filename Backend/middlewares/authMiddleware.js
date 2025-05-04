const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Nincs token!' });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) return res.status(404).json({ message: 'Felhasználó nem található!' });

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Érvénytelen token!' });
  }
};


const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Nincs admin jogosultság!' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
};
