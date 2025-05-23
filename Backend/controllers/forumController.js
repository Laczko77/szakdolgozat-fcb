const ForumPost = require('../models/ForumPost');
const fs = require('fs');
const path = require('path');

// Bejegyzés létrehozása
const createForumPost = async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? req.file.path : '';


    if ((!text || text.trim().length < 3) && !imageUrl) {
      return res.status(400).json({ error: 'Legalább 3 karakteres szöveg vagy kép megadása szükséges.' });
    }
    if (text && text.length > 1000) {
      return res.status(400).json({ error: 'A szöveg legfeljebb 1000 karakter lehet.' });
    }

    const newPost = new ForumPost({
      userId: req.user.id,
      username: req.user.username,
      text: text?.trim() || '',
      imageUrl
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Hiba a bejegyzés létrehozásakor:', err);
    res.status(500).json({ error: 'Szerverhiba a bejegyzés létrehozásakor.' });
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

    // Ha új kép jön, régi törlése
    if (req.file) {
      post.imageUrl = req.file.path;
    }


    if (req.body.text !== undefined) {
      const trimmedText = req.body.text.trim();
      if (trimmedText.length < 3) {
        return res.status(400).json({ error: 'A szöveg legalább 3 karakter legyen.' });
      }
      if (trimmedText.length > 1000) {
        return res.status(400).json({ error: 'A szöveg legfeljebb 1000 karakter lehet.' });
      }
      post.text = trimmedText;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Szerkesztési hiba:', err);
    res.status(500).json({ error: 'Szerverhiba a bejegyzés szerkesztésekor.' });
  }
};


// Bejegyzés törlése
const deleteForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Bejegyzés nem található.' });

    // ha volt kép, akkor töröljük a fájlt
    /*if (post.imageUrl) {
      const imageFileName = post.imageUrl.split('/uploads/forum/')[1];
      if (imageFileName) {
        const filePath = path.join(__dirname, '..', 'uploads', 'forum', imageFileName);
        fs.unlink(filePath, err => {
          if (err) console.error('Nem sikerült törölni a képet:', err);
        });
      }
    }*/

    await post.deleteOne();
    res.json({ message: 'Bejegyzés törölve.' });
  } catch (err) {
    console.error('Szerverhiba bejegyzés törlésekor:', err);
    res.status(500).json({ error: 'Hiba a bejegyzés törlésekor.' });
  }
};

const likeForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Bejegyzés nem található.' });

    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) {
      return res.status(400).json({ error: 'Már lájkoltad ezt a posztot.' });
    }

    post.likes.push(req.user.id);
    await post.save();
    res.json({ message: 'Lájkolva.', likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Hiba történt lájkolás közben.' });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'A komment nem lehet üres.' });

    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Bejegyzés nem található.' });

    post.comments.push({
      userId: req.user.id,
      username: req.user.username,
      text
    });

    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a komment mentésekor.' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Poszt nem található.' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Komment nem található.' });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Nincs jogosultságod szerkeszteni ezt a kommentet.' });
    }

    comment.text = text;
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a komment frissítésekor.' });
  }
};


const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Poszt nem található.' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Komment nem található.' });

    const isOwner = comment.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Nincs jogosultságod törölni ezt a kommentet.' });
    }

    comment.deleteOne();
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a komment törlésekor.' });
  }
};


module.exports = {
  createForumPost,
  getAllForumPosts,
  updateForumPost,
  deleteForumPost,
  likeForumPost,
  addComment,
  updateComment,
  deleteComment
};
