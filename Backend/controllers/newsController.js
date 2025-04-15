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
  const { title, content, imageUrl } = req.body;
  try {
    const newPost = new News({ title, content, imageUrl });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: 'Hiba történt a hír létrehozásakor' });
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

module.exports = {
  getAllNews,
  createNews,
  deleteNews,
};
