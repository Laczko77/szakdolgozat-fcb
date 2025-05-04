const matchController = require('../../controllers/matchController');
const Match = require('../../models/Match');

jest.mock('../../models/Match');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('Match Controller', () => {
    beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => jest.clearAllMocks());

  describe('getAllMatches', () => {
    it('should return all matches', async () => {
      Match.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ opponent: 'Real Madrid' }]) });
      const res = mockRes();
      await matchController.getAllMatches({}, res);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ opponent: 'Real Madrid' })]));
    });
  });

  describe('createMatch', () => {
    it('should create match successfully', async () => {
      Match.mockImplementation(function () {
        this.opponent = 'Atletico';
        this.save = jest.fn().mockResolvedValue(this);
      });

      const req = { body: { opponent: 'Atletico' } };
      const res = mockRes();
      await matchController.createMatch(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ opponent: 'Atletico' }));
    });

    it('should return 400 on error', async () => {
      Match.mockImplementation(() => { throw new Error('hiba'); });
      const req = { body: {} };
      const res = mockRes();
      await matchController.createMatch(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateMatch', () => {
    it('should update match successfully', async () => {
      Match.findByIdAndUpdate.mockResolvedValue({ opponent: 'Updated' });
      const req = { params: { id: '1' }, body: { opponent: 'Updated' } };
      const res = mockRes();
      await matchController.updateMatch(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ opponent: 'Updated' }));
    });

    it('should return 400 on error', async () => {
      Match.findByIdAndUpdate.mockRejectedValue(new Error('hiba'));
      const req = { params: { id: '1' }, body: {} };
      const res = mockRes();
      await matchController.updateMatch(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteMatch', () => {
    it('should delete match', async () => {
      Match.findByIdAndDelete.mockResolvedValue(true);
      const req = { params: { id: '1' } };
      const res = mockRes();
      await matchController.deleteMatch(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Meccs törölve' });
    });

    it('should return 500 on error', async () => {
      Match.findByIdAndDelete.mockRejectedValue(new Error('hiba'));
      const req = { params: { id: '1' } };
      const res = mockRes();
      await matchController.deleteMatch(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getUpcomingMatches', () => {
    it('should return upcoming matches', async () => {
      Match.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ opponent: 'Sevilla' }]) });
      const res = mockRes();
      await matchController.getUpcomingMatches({}, res);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ opponent: 'Sevilla' })]));
    });

    it('should return 500 on error', async () => {
      Match.find.mockImplementation(() => { throw new Error('hiba'); });
      const res = mockRes();
      await matchController.getUpcomingMatches({}, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
