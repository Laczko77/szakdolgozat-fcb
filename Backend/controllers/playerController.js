const Player = require('../models/Player');

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
    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: 'Hiba a játékos létrehozásakor' });
  }
};

// Játékos frissítése
const updatePlayer = async (req, res) => {
  try {
    const updated = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Hiba a játékos frissítésekor' });
  }
};

// Játékos törlése
const deletePlayer = async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Játékos törölve' });
  } catch (err) {
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
