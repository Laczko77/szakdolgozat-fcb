const bcrypt = require('bcrypt');
const User = require('../models/User');

const registerUser = async (userData) => {
  const { username, email, password } = userData;

  // Ellenőrizd, hogy a felhasználó már létezik-e
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Jelszó hash-elése
  const hashedPassword = await bcrypt.hash(password, 10);

  // Új felhasználó létrehozása és mentése
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  return await newUser.save();
};

module.exports = {
  registerUser,
};
