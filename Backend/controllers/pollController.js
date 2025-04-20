const Poll = require('../models/Poll');
const Match = require('../models/Match');
const Player = require('../models/Player');
const User = require('../models/User');
// Szavazás létrehozása
const createPoll = async (req, res) => {
  try {
    const { matchId, questions } = req.body;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ error: 'Meccs nem található.' });

    const players = await Player.find({ isCoach: false });

    const enrichedQuestions = [];

    for (const qObj of questions) {
      const qText = qObj.question;
      let type = '';
      let options = [];

      const lower = qText.toLowerCase();
      if (lower.includes('ki fog nyerni')) {
        type = 'winner';
        options = ['Barcelona', match.opponent, 'Döntetlen'];
      } else if (lower.includes('legjobb') || lower.includes('meccs embere')) {
        type = 'best-player';
        options = players.map(p => p.name);
      } else {
        return res.status(400).json({ error: `Ismeretlen kérdés: "${qText}"` });
      }

      enrichedQuestions.push({
        question: qText,
        questionType: type,
        options,
        correctAnswers: [],
        answers: []
      });
    }

    const poll = new Poll({
      matchId,
      questions: enrichedQuestions
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    console.error('Hiba szavazás létrehozásakor:', err);
    res.status(500).json({ error: 'Szerverhiba.' });
  }
};

// Szavazás lezárása
const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Szavazás nem található.' });

    poll.isClosed = true;
    await poll.save();
    res.json({ message: 'Szavazás lezárva.' });
  } catch (err) {
    console.error('Hiba lezáráskor:', err);
    res.status(500).json({ error: 'Szerverhiba.' });
  }
};

// Szavazás törlése
const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Szavazás nem található.' });
    res.json({ message: 'Szavazás törölve.' });
  } catch (err) {
    console.error('Hiba törléskor:', err);
    res.status(500).json({ error: 'Szerverhiba.' });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
      .populate('matchId', 'opponent date')
      .populate('questions.answers.userId', '_id')
      .sort({ createdAt: -1 });

    res.json(polls);
  } catch (err) {
    console.error('Hiba a szavazások lekérdezésekor:', err);
    res.status(500).json({ error: 'Nem sikerült lekérni a szavazásokat.' });
  }
};

const evaluatePoll = async (req, res) => {
  
  try {
    const pollId = req.params.id;
    const updates = req.body;

    const poll = await Poll.findById(pollId);
    console.log('📥 Kiértékelésre kapott adat:', req.body);
    if (!poll || !poll.isClosed) {
      return res.status(400).json({ error: 'Nem található vagy nincs lezárva a szavazás.' });
    }

    if (!Array.isArray(updates)) {
      console.error('❌ updates nem tömb:', updates);
      return res.status(400).json({ error: 'Érvénytelen formátum: updates nem tömb.' });
    }

    for (const update of updates) {
      const { questionIndex, correctAnswers } = update;
      if (poll.questions[questionIndex]) {
        poll.questions[questionIndex].correctAnswers = correctAnswers;

        for (const answer of poll.questions[questionIndex].answers) {
          if (
            answer?.selectedOption &&
            correctAnswers.includes(answer.selectedOption)
          ) {
            await User.findByIdAndUpdate(answer.userId, { $inc: { score: 1 } });
          }
        }
      }
    }
  
    await poll.save();
    res.json({ message: 'Szavazás kiértékelve és pontozás megtörtént.' });
  } catch (err) {
    console.error('Hiba a szavazás kiértékelésekor:', err);
    res.status(500).json({ error: 'Szerverhiba a kiértékeléskor.' });
  }
};

const votePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { questionIndex, selectedOption } = req.body;

    const poll = await Poll.findById(pollId);
    if (!poll || poll.isClosed) {
      return res.status(400).json({ error: 'Szavazás nem elérhető vagy már lezárult.' });
    }

    const question = poll.questions[questionIndex];
    if (!question || !question.options.includes(selectedOption)) {
      return res.status(400).json({ error: 'Érvénytelen válasz.' });
    }

    const existingVote = question.answers.find(a => a.userId.toString() === req.user.id);
    if (existingVote) {
      return res.status(400).json({ error: 'Már szavaztál erre a kérdésre.' });
    }

    question.answers.push({
      userId: req.user.id,
      selectedOption
    });

    await poll.save();
    res.json({ message: 'Szavazat mentve.' });
  } catch (err) {
    console.error('Hiba szavazat leadásakor:', err);
    res.status(500).json({ error: 'Szerverhiba szavazás közben.' });
  }
};

module.exports = {
  createPoll,
  closePoll,
  deletePoll,
  getAllPolls,
  evaluatePoll,
  votePoll
};
