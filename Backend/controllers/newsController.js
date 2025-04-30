const News = require('../models/News');
const path = require('path');
const fs = require('fs');

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
    const { title, content } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/news/${req.file.filename}`;
    }

    const newNews = new News({
      title,
      content,
      imageUrl
    });

    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a hír létrehozásakor', error });
  }
};



// Hír törlése
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Hír nem található' });

    // Régi kép törlése, ha van
    if (news.imageUrl) {
      const imagePath = path.join(__dirname, '..', 'uploads', 'news', path.basename(news.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

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
    const { title, content } = req.body;
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Hír nem található' });

    let updateData = { title, content };

    if (req.file) {
      // Régi kép törlése
      if (news.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', 'news', path.basename(news.imageUrl));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Új kép beállítása
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/news/${req.file.filename}`;
      updateData.imageUrl = imageUrl;
    }

    const updated = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
