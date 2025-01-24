const bcrypt = require('bcrypt');
const User = require('../models/User');

// Regisztrációs logika
const registerUser = async (userData) => {
  const { username, email, password } = userData;

  try {
    // Ellenőrizd, hogy a felhasználó már létezik-e
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Jelszó hash-elése
    const hashedPassword = await bcrypt.hash(password, 10);

    // Új felhasználó létrehozása
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Felhasználó mentése az adatbázisba
    const savedUser = await newUser.save();
    return savedUser;

  } catch (error) {
    console.error('Error during user registration:', error); // Részletes hiba logolás
    throw error; // Hibát dobunk tovább, hogy a controller is kezelhesse
  }
};

// Felhasználó keresése email alapján
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error during user search by email:', error); // Részletes hiba logolás
    throw error;
  }
};

module.exports = {
  registerUser,
  findUserByEmail,
};
