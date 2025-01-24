const userService = require('../services/userService');
const bcrypt = require('bcrypt'); // bcrypt importálása
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email); // Egy új helper funkciót készíthetsz a szolgáltatásban

    // Ellenőrizd, hogy a felhasználó létezik-e
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Ellenőrizd a jelszót
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generálj egy JWT-t
    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
};
