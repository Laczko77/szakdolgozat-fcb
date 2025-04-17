const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number
  },
  position: {
    type: String
  },
  nationality: {
    type: String
  },
  birthDate: {
    type: Date
  },
  imageUrl: {
    type: String
  },
  appearances: {
    type: Number,
    default: 0
  },
  goals: {
    type: Number,
    default: 0
  },
  assists: {
    type: Number,
    default: 0
  },
  isCoach: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
