const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '', // nem kötelező, lehet üres is
  }
});

module.exports = mongoose.model('News', newsSchema);
