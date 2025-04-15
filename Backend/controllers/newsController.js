const News = require('../models/News');

// Összes hír lekérése
const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Hiba történt a hírek lekérésekor' });
  }
};

// Új hír létrehozása
const createNews = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    const newNews = new News({ title, content, imageUrl });
    await newNews.save();

    res.status(201).json(newNews);
  } catch (error) {
    console.error('Hír létrehozási hiba:', error);
    res.status(500).json({ message: 'Nem sikerült létrehozni a hírt.' });
  }
};

// Hír törlése
const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hír sikeresen törölve' });
  } catch (err) {
    res.status(500).json({ message: 'Hiba történt a törlés során' });
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Hír nem található' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Hiba a hír lekérésekor' });
  }
};


  const updateNews = async (req, res) => {
    try {
      const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Hír nem található' });
      res.json(updated);
    } catch (err) {
      console.error('Hiba a hír frissítésekor:', err);
      res.status(500).json({ message: 'Nem sikerült frissíteni a hírt.' });
    }
  };

module.exports = {
  getAllNews,
  createNews,
  deleteNews,
  getNewsById,
  updateNews
};
