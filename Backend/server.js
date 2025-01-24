const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// MongoDB kapcsolódás
mongoose.connect('mongodb://localhost:27017/Szakdolgozat')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const port = 3000;

// Middleware-ek
app.use(cors()); // Ha az Angular és a backend különböző porton fut
app.use(express.json()); // JSON adatok kezelése

// User modell (ez lehet egy külön fájlban is)
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String,
}));

// Regisztrációs endpoint
app.post('/api/users/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Új felhasználó mentése MongoDB-be
  const newUser = new User({ username, email, password });
  
  newUser.save()
    .then(user => res.status(201).json({ message: 'User registered successfully', user }))
    .catch(err => res.status(400).json({ error: 'Error registering user', details: err }));
});

// Alap route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
