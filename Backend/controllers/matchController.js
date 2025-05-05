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
    const { opponent, home, date, competition, matchday, score } = req.body;

    if (!opponent || opponent.trim().length < 2) {
      return res.status(400).json({ message: 'Az ellenfél neve kötelező, és legalább 2 karakter.' });
    }

    if (!home || !['home', 'away', 'neutral'].includes(home)) {
      return res.status(400).json({ message: 'A helyszín (home) mező érvénytelen vagy hiányzik.' });
    }

    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Érvényes dátum szükséges.' });
    }

    if (!competition || competition.trim().length < 2) {
      return res.status(400).json({ message: 'A sorozat neve kötelező.' });
    }

    const match = new Match({
      opponent: opponent.trim(),
      home: home, 
      date: new Date(date),
      competition: competition.trim(), 
      matchday: matchday,
      score: score || ''
    });
    

    await match.save();
    res.status(201).json(match);
  } catch (err) {
    console.error('Hiba a meccs létrehozásakor:', err);
    res.status(500).json({ message: 'Szerverhiba a meccs létrehozásakor.' });
  }
};


const updateMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Meccs nem található.' });

    const { opponent, home, date, competition, matchday, score } = req.body;

    if (opponent !== undefined) {
      if (opponent.trim().length < 2) {
        return res.status(400).json({ message: 'Az ellenfél neve legalább 2 karakter legyen.' });
      }
      match.opponent = opponent.trim();
    }

    if (home !== undefined) {
      if (!['home', 'away', 'neutral'].includes(home)) {
        return res.status(400).json({ message: 'Érvénytelen helyszín (home).' });
      }
      match.home = home;

    }

    if (date !== undefined) {
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({ message: 'Érvénytelen dátumformátum.' });
      }
      match.date = new Date(date);
    }

    if (competition !== undefined) {
      if (competition.trim().length < 2) {
        return res.status(400).json({ message: 'A sorozat legalább 2 karakter hosszú legyen.' });
      }
      match.competition = competition.trim();
    }

    if (matchday !== undefined) {
      match.matchday = matchday;
    }

    if (score !== undefined) {
      match.score = score;
    }

    await match.save();
    res.json(match);
  } catch (err) {
    console.error('Hiba a meccs frissítésekor:', err);
    res.status(500).json({ message: 'Szerverhiba a meccs frissítésekor.' });
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

const getUpcomingMatches = async (req, res) => {
  try {
    const upcoming = await Match.find({ date: { $gte: new Date() } }).sort({ date: 1 });
    res.json(upcoming);
  } catch (err) {
    console.error('Hiba a közelgő meccsek lekérésekor:', err);
    res.status(500).json({ error: 'Nem sikerült lekérni a közelgő meccseket.' });
  }
};

module.exports = {
  getAllMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  getUpcomingMatches
};
