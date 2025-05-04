const request = require('supertest');
const express = require('express');
const app = express();
const userController = require('../../controllers/userController');
const userService = require('../../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Google-auth mock
jest.mock('google-auth-library');
const { __mockVerifyIdToken } = require('google-auth-library');

jest.mock('../../services/userService');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../models/User');

// Express app route-ok csak ehhez a controllerhez
app.use(express.json());
app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);
app.post('/api/users/google-login', userController.googleLogin);
app.get('/api/users/leaderboard', userController.getLeaderboard);

describe('User Controller', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should register a new user and return 201', async () => {
      const newUser = { username: 'teszt', email: 'teszt@example.com' };
      userService.registerUser.mockResolvedValue(newUser);

      const response = await request(app).post('/api/users/register').send({
        username: 'teszt',
        email: 'teszt@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user', newUser);
    });

    it('should return 400 if registration fails', async () => {
      userService.registerUser.mockRejectedValue(new Error('hiba'));

      const response = await request(app).post('/api/users/register').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'hiba');
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const user = {
        _id: 'user123',
        username: 'teszt',
        password: 'hashedpass',
        role: 'user'
      };

      userService.findUserByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedToken');

      const response = await request(app).post('/api/users/login').send({
        email: 'teszt@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token', 'mockedToken');
    });

    it('should return 400 for invalid credentials', async () => {
      userService.findUserByEmail.mockResolvedValue(null);

      const response = await request(app).post('/api/users/login').send({
        email: 'wrong@example.com',
        password: 'wrongpass'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('googleLogin', () => {
    it('should login or register a user using Google token', async () => {
      __mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          email: 'test@example.com',
          name: 'Teszt Elek'
        })
      });

      userService.findUserByEmail.mockResolvedValue(null);
      User.mockImplementation(() => ({
        save: jest.fn(),
        _id: 'userId123',
        username: 'Teszt Elek',
        role: 'user'
      }));
      bcrypt.hash.mockResolvedValue('hashedDummy');
      jwt.sign.mockReturnValue('mockedGoogleToken');

      const response = await request(app).post('/api/users/google-login').send({
        token: 'mockedGoogleToken123'
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Google login successful');
      expect(response.body).toHaveProperty('token', 'mockedGoogleToken');
    });

    it('should return 401 for invalid token', async () => {
      __mockVerifyIdToken.mockRejectedValue(new Error('Invalid'));

      const response = await request(app).post('/api/users/google-login').send({
        token: 'invalid'
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid Google token');
    });
  });

  describe('getLeaderboard', () => {
    it('should return top 5 users sorted by score', async () => {
      const mockUsers = [
        { username: 'A', score: 99 },
        { username: 'B', score: 90 }
      ];

      User.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockUsers)
      });

      const response = await request(app).get('/api/users/leaderboard');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should handle error and return 500', async () => {
      User.find.mockImplementation(() => {
        throw new Error('DB hiba');
      });

      const response = await request(app).get('/api/users/leaderboard');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Nem sikerült lekérni a toplistát.');
    });
  });
});
