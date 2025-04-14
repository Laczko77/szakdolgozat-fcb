const mongoose = require('mongoose'); 
// A Mongoose csomag betöltése, amelyet MongoDB adatbázis kezelésére használunk.

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  // A 'username' mező string típusú, kötelező (required), és egyedinek kell lennie az adatbázisban.
  
  email: { type: String, required: true, unique: true },
  // Az 'email' mező string típusú, kötelező (required), és szintén egyedinek kell lennie az adatbázisban.
  
  password: { type: String, required: true },
  // A 'password' mező string típusú és kötelező (required). Ez fogja tárolni a felhasználók jelszavait, amelyeket általában titkosítani szokás (pl. bcrypttel).
});

module.exports = mongoose.model('User', userSchema);
// A 'User' nevű Mongoose modell exportálása, amely az 'userSchema'-t használja.
// Ezzel a modellel lehet CRUD (Create, Read, Update, Delete) műveleteket végezni a MongoDB 'users' kollekcióján.
