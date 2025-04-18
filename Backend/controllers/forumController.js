const ForumPost = require('../models/ForumPost');
const fs = require('fs');

exports.createForumPost = async (req, res) => {
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

exports.getAllForumPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ _id: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a bejegyzések lekérdezésekor.' });
  }
};

exports.deleteForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Bejegyzés nem található.' });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Nincs jogosultságod törölni ezt a bejegyzést.' });
    }

    // ha volt kép, akkor töröljük a fájlt is
    if (post.imageUrl) {
      const path = `.${post.imageUrl}`;
      fs.unlink(path, err => {
        if (err) console.error('Nem sikerült törölni a képet:', err);
      });
    }

    await post.deleteOne();
    res.json({ message: 'Bejegyzés törölve.' });
  } catch (err) {
    res.status(500).json({ error: 'Hiba a bejegyzés törlésekor.' });
  }
};
