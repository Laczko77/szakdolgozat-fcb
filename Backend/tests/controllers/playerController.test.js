const playerController = require('../../controllers/playerController');
const Player = require('../../models/Player');
const fs = require('fs');
const path = require('path');

jest.mock('../../models/Player');
jest.mock('fs');

describe('Player Controller', () => {
  afterEach(() => jest.clearAllMocks());

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('getAllPlayers', () => {
    it('should return players list', async () => {
      Player.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ name: 'Messi' }]) });
      const res = mockRes();
      await playerController.getAllPlayers({}, res);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: 'Messi' })]));
    });
  });

  describe('getPlayerById', () => {
    it('should return player if found', async () => {
      Player.findById.mockResolvedValue({ name: 'Messi' });
      const req = { params: { id: '1' } };
      const res = mockRes();
      await playerController.getPlayerById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Messi' }));
    });

    it('should return 404 if not found', async () => {
      Player.findById.mockRejectedValue(new Error());
      const req = { params: { id: '1' } };
      const res = mockRes();
      await playerController.getPlayerById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createPlayer', () => {
    it('should create player successfully', async () => {
        const req = {
          body: { name: 'Messi' },
          file: { filename: 'messi.jpg' },
          protocol: 'http',
          get: () => 'localhost:3000'
        };
      
        Player.mockImplementation(function () {
          this.name = 'Messi';
          this.save = jest.fn().mockResolvedValue(this);
        });
      
        const res = mockRes();
        await playerController.createPlayer(req, res);
      
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Messi' }));
      });
      
      

    it('should return 400 on error', async () => {
      Player.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error())
      }));
      const req = { body: { name: 'Hiba' } };
      const res = mockRes();
      await playerController.createPlayer(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updatePlayer', () => {
    it('should update player successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { name: 'Xavi' },
        file: { filename: 'xavi.jpg' },
        protocol: 'http',
        get: () => 'localhost:3000'
      };

      const existing = { imageUrl: '', _id: '1' };
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});
      Player.findById.mockResolvedValue(existing);
      Player.findByIdAndUpdate = jest.fn().mockResolvedValue({ name: 'Xavi' });

      const res = mockRes();
      await playerController.updatePlayer(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Xavi' }));
    });

    it('should return 404 if player not found', async () => {
      Player.findById.mockResolvedValue(null);
      const req = { params: { id: '1' }, body: {} };
      const res = mockRes();
      await playerController.updatePlayer(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deletePlayer', () => {
    it('should delete player and image', async () => {
      const mockDelete = jest.fn();
      Player.findById.mockResolvedValue({
        deleteOne: mockDelete,
        imageUrl: 'http://localhost:3000/uploads/players/messi.jpg'
      });
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});
      const req = { params: { id: '1' } };
      const res = mockRes();

      await playerController.deletePlayer(req, res);
      expect(mockDelete).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Játékos törölve' });
    });

    it('should return 404 if not found', async () => {
      Player.findById.mockResolvedValue(null);
      const req = { params: { id: '1' } };
      const res = mockRes();
      await playerController.deletePlayer(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
