const newsController = require('../../controllers/newsController');
const News = require('../../models/News');
const fs = require('fs');
const path = require('path');

jest.mock('../../models/News');
jest.mock('fs');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('News Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getAllNews', () => {
    it('should return all news', async () => {
      News.find.mockResolvedValue([{ title: 'Hír1' }]);
      const res = mockRes();
      await newsController.getAllNews({}, res);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ title: 'Hír1' })]));
    });
  });

  describe('getNewsById', () => {
    it('should return news if found', async () => {
      News.findById.mockResolvedValue({ title: 'Hír1' });
      const req = { params: { id: '1' } };
      const res = mockRes();
      await newsController.getNewsById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Hír1' }));
    });

    it('should return 404 if not found', async () => {
      News.findById.mockResolvedValue(null);
      const req = { params: { id: '1' } };
      const res = mockRes();
      await newsController.getNewsById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createNews', () => {
    it('should create news successfully', async () => {
      News.mockImplementation(function () {
        this.title = 'Új hír';
        this.save = jest.fn().mockResolvedValue(this);
      });

      const req = {
        body: { title: 'Új hír', content: 'Szöveg' },
        file: { filename: 'img.jpg' },
        protocol: 'http',
        get: () => 'localhost:3000'
      };

      const res = mockRes();
      await newsController.createNews(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Új hír' }));
    });
  });

  describe('deleteNews', () => {
    it('should delete news and image', async () => {
      const deleteMock = jest.fn();
      const fakeNews = {
        imageUrl: 'http://localhost:3000/uploads/news/img.jpg',
        deleteOne: deleteMock
      };
      News.findById.mockResolvedValue(fakeNews);
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});
      News.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      const req = { params: { id: '123' } };
      const res = mockRes();
      await newsController.deleteNews(req, res);

      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Hír sikeresen törölve' });
    });

    it('should return 404 if news not found', async () => {
      News.findById.mockResolvedValue(null);
      const req = { params: { id: '123' } };
      const res = mockRes();
      await newsController.deleteNews(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateNews', () => {
    it('should update news successfully', async () => {
      const existingNews = { imageUrl: '', title: 'Régi hír' };
      News.findById.mockResolvedValue(existingNews);
      News.findByIdAndUpdate = jest.fn().mockResolvedValue({ title: 'Frissített hír' });

      const req = {
        params: { id: '1' },
        body: { title: 'Frissített hír', content: 'Új szöveg' },
        file: { filename: 'uj.jpg' },
        protocol: 'http',
        get: () => 'localhost:3000'
      };
      const res = mockRes();
      await newsController.updateNews(req, res);

      expect(News.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Frissített hír' }));
    });

    it('should return 404 if not found', async () => {
      News.findById.mockResolvedValue(null);
      const req = { params: { id: '1' }, body: {} };
      const res = mockRes();
      await newsController.updateNews(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
