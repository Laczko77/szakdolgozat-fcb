const pollController = require('../../controllers/pollController');
const Poll = require('../../models/Poll');
const Match = require('../../models/Match');
const Player = require('../../models/Player');
const User = require('../../models/User');

jest.mock('../../models/Poll');
jest.mock('../../models/Match');
jest.mock('../../models/Player');
jest.mock('../../models/User');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('Poll Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createPoll', () => {
    it('should create poll with best-player question', async () => {
      Match.findById.mockResolvedValue({ _id: 'match123', opponent: 'Madrid' });
      Player.find.mockResolvedValue([{ name: 'Messi' }, { name: 'Xavi' }]);
      Poll.prototype.save = jest.fn().mockResolvedValue({ questions: [] });

      const req = {
        body: {
          matchId: 'match123',
          questions: [{ question: 'Ki lesz a meccs embere?' }]
        },
        protocol: 'http',
        get: () => 'localhost:3000'
      };
      const res = mockRes();

      await pollController.createPoll(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 for unknown question', async () => {
      Match.findById.mockResolvedValue({ opponent: 'Madrid' });

      const req = {
        body: {
          matchId: 'match123',
          questions: [{ question: 'Ez egy ismeretlen kérdés?' }]
        },
        protocol: 'http',
        get: () => 'localhost:3000'
      };
      const res = mockRes();
      await pollController.createPoll(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('closePoll', () => {
    it('should close poll successfully', async () => {
      const save = jest.fn();
      Poll.findById.mockResolvedValue({ save });

      const req = { params: { id: 'poll123' } };
      const res = mockRes();
      await pollController.closePoll(req, res);
      expect(save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Szavazás lezárva.' });
    });

    it('should return 404 if poll not found', async () => {
      Poll.findById.mockResolvedValue(null);
      const req = { params: { id: 'poll123' } };
      const res = mockRes();
      await pollController.closePoll(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('votePoll', () => {
    it('should allow voting', async () => {
      const poll = {
        isClosed: false,
        questions: [
          {
            options: ['A', 'B'],
            answers: [],
          }
        ],
        save: jest.fn()
      };

      Poll.findById.mockResolvedValue(poll);

      const req = {
        params: { id: 'poll123' },
        body: { questionIndex: 0, selectedOption: 'A' },
        user: { id: 'user123' }
      };
      const res = mockRes();
      await pollController.votePoll(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Szavazat mentve.' });
    });
  });

  describe('deletePoll', () => {
    it('should delete poll successfully', async () => {
      Poll.findByIdAndDelete.mockResolvedValue({});
      const req = { params: { id: 'poll123' } };
      const res = mockRes();
      await pollController.deletePoll(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Szavazás törölve.' });
    });
  });
});
describe('createPoll', () => {
  it('should return 404 if match not found', async () => {
    Match.findById.mockResolvedValue(null);

    const req = {
      body: {
        matchId: 'invalidId',
        questions: [{ question: 'Ki fog nyerni?' }]
      }
    };
    const res = mockRes();

    await pollController.createPoll(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should return 500 on exception', async () => {
    Match.findById.mockRejectedValue(new Error('DB hiba'));
    const req = {
      body: {
        matchId: 'match123',
        questions: [{ question: 'Ki fog nyerni?' }]
      }
    };
    const res = mockRes();

    await pollController.createPoll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('closePoll', () => {
  it('should return 500 if error occurs', async () => {
    Poll.findById.mockRejectedValue(new Error('DB hiba'));
    const req = { params: { id: 'poll123' } };
    const res = mockRes();

    await pollController.closePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('deletePoll', () => {
  it('should return 404 if poll not found', async () => {
    Poll.findByIdAndDelete.mockResolvedValue(null);
    const req = { params: { id: 'missingPoll' } };
    const res = mockRes();

    await pollController.deletePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('votePoll', () => {
  it('should return 400 if poll not found or closed', async () => {
    Poll.findById.mockResolvedValue(null);

    const req = {
      params: { id: 'poll123' },
      body: { questionIndex: 0, selectedOption: 'A' },
      user: { id: 'user123' }
    };
    const res = mockRes();

    await pollController.votePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 if selected option is invalid', async () => {
    Poll.findById.mockResolvedValue({
      isClosed: false,
      questions: [{ options: ['A'], answers: [] }],
      save: jest.fn()
    });

    const req = {
      params: { id: 'poll123' },
      body: { questionIndex: 0, selectedOption: 'Invalid' },
      user: { id: 'user123' }
    };
    const res = mockRes();

    await pollController.votePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 if user already voted', async () => {
    Poll.findById.mockResolvedValue({
      isClosed: false,
      questions: [{
        options: ['A'],
        answers: [{ userId: 'user123', selectedOption: 'A' }]
      }],
      save: jest.fn()
    });

    const req = {
      params: { id: 'poll123' },
      body: { questionIndex: 0, selectedOption: 'A' },
      user: { id: 'user123' }
    };
    const res = mockRes();

    await pollController.votePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 500 if internal error occurs', async () => {
    Poll.findById.mockRejectedValue(new Error('DB hiba'));

    const req = {
      params: { id: 'poll123' },
      body: { questionIndex: 0, selectedOption: 'A' },
      user: { id: 'user123' }
    };
    const res = mockRes();

    await pollController.votePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('evaluatePoll', () => {
  it('should return 400 if poll not found or not closed', async () => {
    Poll.findById.mockResolvedValue({ isClosed: false });
    const req = { params: { id: 'poll123' }, body: [] };
    const res = mockRes();

    await pollController.evaluatePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 if updates is not array', async () => {
    Poll.findById.mockResolvedValue({ isClosed: true, questions: [] });
    const req = { params: { id: 'poll123' }, body: {} };
    const res = mockRes();

    await pollController.evaluatePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should evaluate and give points correctly', async () => {
    const save = jest.fn();
    const poll = {
      isClosed: true,
      questions: [
        {
          correctAnswers: [],
          answers: [{ userId: 'user123', selectedOption: 'A' }]
        }
      ],
      save
    };

    Poll.findById.mockResolvedValue(poll);
    User.findByIdAndUpdate.mockResolvedValue();

    const req = {
      params: { id: 'poll123' },
      body: [{ questionIndex: 0, correctAnswers: ['A'] }]
    };
    const res = mockRes();

    await pollController.evaluatePoll(req, res);
    expect(save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Szavazás kiértékelve és pontozás megtörtént.'
    });
  });

  it('should return 500 on error', async () => {
    Poll.findById.mockRejectedValue(new Error('DB hiba'));
    const req = { params: { id: 'poll123' }, body: [] };
    const res = mockRes();

    await pollController.evaluatePoll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
