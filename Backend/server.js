const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB kapcsolódás
mongoose.connect('mongodb://localhost:27017/Szakdolgozat')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const port = 3000;

// Middleware-ek
app.use(cors()); // Ha az Angular és a backend különböző porton fut
app.use(express.json()); // JSON adatok kezelése

// Alap route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Példa egy POST végpontra
app.post('/data', (req, res) => {
    const data = req.body;
    console.log('Data received:', data);
    res.json({ message: 'Data saved to MongoDB' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});