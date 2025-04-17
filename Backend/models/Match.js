const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  competition: {
    type: String,
    required: true
  },
  matchday: {
    type: String,
    required: true
  },
  opponent: {
    type: String,
    required: true
  },
  home: {
    type: String,
    enum: ['home', 'away', 'neutral'],
    required: true
  },
  score: {
    type: String, // pl. "2-1"
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);
