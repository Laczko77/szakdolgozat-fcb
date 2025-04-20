const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  questions: [
    {
      question: String,
      questionType: String,
      options: [String],
      correctAnswers: [String],
      answers: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          selectedOption: String
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
