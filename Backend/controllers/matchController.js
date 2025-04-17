const Match = require('../models/Match');

// Összes meccs lekérdezése
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Hiba a meccsek lekérdezésekor' });
  }
};

// Új meccs létrehozása
const createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ message: 'Hiba a meccs létrehozásakor' });
  }
};

// Meccs frissítése
const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(match);
  } catch (err) {
    res.status(400).json({ message: 'Hiba a meccs frissítésekor' });
  }
};

// Meccs törlése
const deleteMatch = async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meccs törölve' });
  } catch (err) {
    res.status(500).json({ message: 'Hiba a meccs törlésekor' });
  }
};

module.exports = {
  getAllMatches,
  createMatch,
  updateMatch,
  deleteMatch
};
