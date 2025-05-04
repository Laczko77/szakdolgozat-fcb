const bcrypt = require('bcrypt');
const User = require('../../models/User');
const userService = require('../../services/userService');

jest.mock('../../models/User');
jest.mock('bcrypt');

describe('userService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'tesztuser',
        email: 'teszt@example.com',
        password: 'jelszo123'
      };

      User.findOne.mockResolvedValue(null); // nincs ilyen felhasználó
      bcrypt.hash.mockResolvedValue('hashed_pw');
      const savedUserMock = { _id: 'user123', ...userData, password: 'hashed_pw' };
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedUserMock)
      }));

      const result = await userService.registerUser(userData);

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ username: userData.username }, { email: userData.email }]
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(result).toEqual(savedUserMock);
    });

    it('should throw error if user already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'existing' });

      const userData = {
        username: 'existing',
        email: 'existing@example.com',
        password: 'secret'
      };

      await expect(userService.registerUser(userData)).rejects.toThrow('User already exists');
    });

    it('should throw and log error if save fails', async () => {
      const error = new Error('DB hiba');
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_pw');
      User.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      const userData = {
        username: 'failuser',
        email: 'fail@example.com',
        password: 'pw'
      };

      await expect(userService.registerUser(userData)).rejects.toThrow('DB hiba');
    });
  });

  describe('findUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { email: 'teszt@example.com', username: 'teszt' };
      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail('teszt@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'teszt@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if find fails', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));

      await expect(userService.findUserByEmail('fail@example.com')).rejects.toThrow('DB error');
    });
  });
});
