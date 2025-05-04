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

    if (!title || title.trim().length < 5) {
      return res.status(400).json({ message: 'A cím legalább 5 karakter hosszú legyen.' });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({ message: 'A tartalom legalább 10 karakter hosszú legyen.' });
    }

    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/news/${req.file.filename}`
      : '';

    const newNews = new News({
      title: title.trim(),
      content: content.trim(),
      imageUrl
    });

    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    console.error('Hiba a hír létrehozásakor:', error);
    res.status(500).json({ message: 'Szerverhiba a hír létrehozásakor.' });
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
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Hír nem található' });

    const updateData = {};

    if (req.body.title !== undefined) {
      if (req.body.title.trim().length < 5) {
        return res.status(400).json({ message: 'A cím legalább 5 karakter hosszú legyen.' });
      }
      updateData.title = req.body.title.trim();
    }

    if (req.body.content !== undefined) {
      if (req.body.content.trim().length < 10) {
        return res.status(400).json({ message: 'A tartalom legalább 10 karakter hosszú legyen.' });
      }
      updateData.content = req.body.content.trim();
    }

    if (req.file) {
      // töröljük a régit
      if (news.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', 'news', path.basename(news.imageUrl));
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/news/${req.file.filename}`;
    }

    const updated = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Hiba a hír frissítésekor:', err);
    res.status(500).json({ message: 'Szerverhiba a hír frissítésekor.' });
  }
};





module.exports = {
  getAllNews,
  createNews,
  deleteNews,
  getNewsById,
  updateNews
};
