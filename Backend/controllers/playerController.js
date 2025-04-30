const Player = require('../models/Player');
const fs = require('fs');
const path = require('path');


// Összes játékos lekérdezése
const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ isCoach: 1, number: 1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: 'Hiba a játékosok lekérdezésekor' });
  }
};

// Egy játékos lekérdezése
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    res.json(player);
  } catch (err) {
    res.status(404).json({ message: 'Játékos nem található' });
  }
};

// Új játékos létrehozása
const createPlayer = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.imageUrl = `${req.protocol}://${req.get('host')}/uploads/players/${req.file.filename}`;
    }
    const newPlayer = new Player(data);
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: 'Hiba a játékos létrehozásakor' });
  }
};


// Játékos frissítése
const updatePlayer = async (req, res) => {
  try {
    const existingPlayer = await Player.findById(req.params.id);
    if (!existingPlayer) return res.status(404).json({ message: 'Játékos nem található' });

    const data = req.body;

    if (req.file) {
      // Régi kép törlése
      if (existingPlayer.imageUrl) {
        const oldPath = path.join(__dirname, '..', 'uploads', 'players', path.basename(existingPlayer.imageUrl));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.imageUrl = `${req.protocol}://${req.get('host')}/uploads/players/${req.file.filename}`;
    }

    const updated = await Player.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Hiba a játékos frissítésekor' });
  }
};


// Játékos törlése
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Játékos nem található' });

    // Ha van feltöltött kép, töröljük a fájlt
    if (player.imageUrl) {
      const imagePath = path.join(__dirname, '..', 'uploads', 'players', path.basename(player.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await player.deleteOne();
    res.json({ message: 'Játékos törölve' });
  } catch (err) {
    console.error('Hiba a játékos törlésekor:', err);
    res.status(500).json({ message: 'Hiba a játékos törlésekor' });
  }
};


module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};
