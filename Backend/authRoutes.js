const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/Szakdolgozat"; // A saját MongoDB-címed
const client = new MongoClient(uri);
const dbName = "fcb-szakdolgozat";

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ellenőrzés: hiányzó adatok
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Ellenőrzés: email vagy username már létezik
    const existingUser = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Jelszó hash-elése
    const hashedPassword = await bcrypt.hash(password, 10);

    // Új user mentése
    await usersCollection.insertOne({ username, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

module.exports = router;
