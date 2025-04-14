const bcrypt = require('bcrypt');
// A bcrypt könyvtár betöltése, amelyet jelszavak hash-elésére és ellenőrzésére használunk.

const User = require('../models/User');
// A korábban definiált User modellt importáljuk, amely a MongoDB adatbázis "users" kollekciójával dolgozik.

// Regisztrációs logika
const registerUser = async (userData) => {
  // Az userData objektumból kinyerjük a felhasználói adatokat
  const { username, email, password } = userData;

  try {
    // Ellenőrizzük, hogy van-e már felhasználó ugyanazzal a felhasználónévvel vagy email címmel
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    // $or operátor: a feltétel akkor igaz, ha a 'username' VAGY 'email' egyezik
    if (existingUser) {
      throw new Error('User already exists'); 
      // Hiba dobása, ha a felhasználó már létezik
    }

    // Jelszó hash-elése bcrypt segítségével
    const hashedPassword = await bcrypt.hash(password, 10);
    // A '10' az ún. "salt rounds", amely a hash-elés biztonságát növeli

    // Új felhasználó létrehozása a Mongoose modell alapján
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // A jelszót hash-elve tároljuk
    });

    // Az új felhasználó mentése az adatbázisba
    const savedUser = await newUser.save();
    return savedUser; // A mentett felhasználót visszaadjuk, hogy a hívó használhassa

  } catch (error) {
    console.error('Error during user registration:', error);
    // Hiba logolása, hogy könnyebb legyen nyomkövetni a problémákat
    throw error; // Hibát dobunk tovább, hogy a controller tudja kezelni
  }
};

// Felhasználó keresése email alapján
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }); 
    // Egyetlen felhasználó keresése az 'email' mező alapján
    return user; // A megtalált felhasználót visszaadjuk
  } catch (error) {
    console.error('Error during user search by email:', error);
    // Hiba logolása
    throw error; // A hiba továbbadása
  }
};

// A funkciók exportálása, hogy más fájlokban is használhatók legyenek
module.exports = {
  registerUser,
  findUserByEmail,
};
