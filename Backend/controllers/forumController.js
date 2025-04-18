const ForumPost = require('../models/ForumPost');
const fs = require('fs');
const path = require('path');

// Bejegyzés létrehozása
const createForumPost = async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/forum/${req.file.filename}`
      : '';

    if (!text && !imageUrl) {
      return res.status(400).json({ error: 'Legalább szöveg vagy kép szükséges.' });
    }

    const newPost = new ForumPost({
      userId: req.user.id,
      username: req.user.username,
      text,
      imageUrl
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a bejegyzés létrehozásakor.' });
  }
};

// Bejegyzések lekérése
const getAllForumPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ _id: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a bejegyzések lekérdezésekor.' });
  }
};

// Bejegyzés szerkesztése
const updateForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Bejegyzés nem található.' });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Nincs jogosultságod szerkeszteni ezt a bejegyzést.' });
    }

    // Ha új kép jön, régit töröljük
    if (req.file) {
      if (post.imageUrl) {
        const oldPath = `.${post.imageUrl}`;
        fs.unlink(oldPath, err => {
          if (err) console.error('Régi kép törlése sikertelen:', err);
        });
      }
      post.imageUrl = `${req.protocol}://${req.get('host')}/uploads/forum/${req.file.filename}`;
    }

    if (req.body.text !== undefined) {
      post.text = req.body.text;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Szerkesztési hiba:', err);
    res.status(500).json({ error: 'Hiba a bejegyzés szerkesztésekor.' });
  }
};

// Bejegyzés törlése
const deleteForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Bejegyzés nem található.' });

    // ha volt kép, akkor töröljük a fájlt
    if (post.imageUrl) {
      const imageFileName = post.imageUrl.split('/uploads/forum/')[1];
      if (imageFileName) {
        const filePath = path.join(__dirname, '..', 'uploads', 'forum', imageFileName);
        fs.unlink(filePath, err => {
          if (err) console.error('Nem sikerült törölni a képet:', err);
        });
      }
    }

    await post.deleteOne();
    res.json({ message: 'Bejegyzés törölve.' });
  } catch (err) {
    console.error('Szerverhiba bejegyzés törlésekor:', err);
    res.status(500).json({ error: 'Hiba a bejegyzés törlésekor.' });
  }
};

module.exports = {
  createForumPost,
  getAllForumPosts,
  updateForumPost,
  deleteForumPost
};
