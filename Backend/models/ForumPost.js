const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
});

module.exports = mongoose.model('ForumPost', forumPostSchema);
