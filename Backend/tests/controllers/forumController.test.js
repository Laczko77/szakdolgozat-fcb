const express = require('express');
const request = require('supertest');
const forumController = require('../../controllers/forumController');
const ForumPost = require('../../models/ForumPost');
const fs = require('fs');
const path = require('path');

jest.mock('../../models/ForumPost');
jest.mock('fs');
jest.mock('path');

// Express app csak ehhez a controllerhez
const app = express();
app.use(express.json());

app.post('/api/forum', mockAuth, forumController.createForumPost);
app.get('/api/forum', forumController.getAllForumPosts);
app.put('/api/forum/:id', mockAuth, forumController.updateForumPost);
app.delete('/api/forum/:id', mockAuth, forumController.deleteForumPost);
app.post('/api/forum/:id/like', mockAuth, forumController.likeForumPost);
app.post('/api/forum/:id/comment', mockAuth, forumController.addComment);
app.put('/api/forum/:id/comment', mockAuth, forumController.updateComment);
app.delete('/api/forum/:id/comment', mockAuth, forumController.deleteComment);

// Mock middleware: beszúr egy user-t a req-be
function mockAuth(req, res, next) {
  req.user = { id: 'user123', username: 'tesztuser', role: 'user' };
  next();
}

describe('forumController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createForumPost', () => {
    it('should create post with text', async () => {
      const mockSave = jest.fn();
      ForumPost.mockImplementation(() => ({ save: mockSave }));

      const response = await request(app).post('/api/forum').send({ text: 'Teszt poszt' });
      expect(response.status).toBe(201);
      expect(mockSave).toHaveBeenCalled();
    });

    it('should return 400 if no text and no image', async () => {
      const response = await request(app).post('/api/forum').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle error and return 500', async () => {
      ForumPost.mockImplementation(() => ({
        save: () => { throw new Error('Mentési hiba'); }
      }));
      const response = await request(app).post('/api/forum').send({ text: 'Teszt' });
      expect(response.status).toBe(500);
    });
  });

  describe('getAllForumPosts', () => {
    it('should return sorted posts', async () => {
      const posts = [{ text: '1' }, { text: '2' }];
      ForumPost.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(posts)
      });
      const res = await request(app).get('/api/forum');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(posts);
    });

    it('should handle error', async () => {
      ForumPost.find.mockImplementation(() => { throw new Error(); });
      const res = await request(app).get('/api/forum');
      expect(res.status).toBe(500);
    });
  });

  describe('updateForumPost', () => {
    it('should update post text', async () => {
      const post = {
        userId: 'user123',
        save: jest.fn(),
        text: 'old'
      };
      ForumPost.findById.mockResolvedValue(post);

      const res = await request(app).put('/api/forum/abc').send({ text: 'új' });
      expect(res.status).toBe(200);
      expect(post.text).toBe('új');
    });

    it('should return 403 if not owner', async () => {
      ForumPost.findById.mockResolvedValue({ userId: 'otherUser' });
      const res = await request(app).put('/api/forum/abc').send({ text: 'új' });
      expect(res.status).toBe(403);
    });

    it('should return 404 if not found', async () => {
      ForumPost.findById.mockResolvedValue(null);
      const res = await request(app).put('/api/forum/abc').send({ text: 'új' });
      expect(res.status).toBe(404);
    });
  });

  describe('deleteForumPost', () => {
    it('should delete post and image', async () => {
      const post = {
        userId: 'user123',
        deleteOne: jest.fn(),
        imageUrl: 'http://localhost/uploads/forum/image.png'
      };
      ForumPost.findById.mockResolvedValue(post);
      const res = await request(app).delete('/api/forum/123');
      expect(res.status).toBe(200);
      expect(post.deleteOne).toHaveBeenCalled();
      expect(fs.unlink).toHaveBeenCalled();
    });

    it('should return 404 if not found', async () => {
      ForumPost.findById.mockResolvedValue(null);
      const res = await request(app).delete('/api/forum/123');
      expect(res.status).toBe(404);
    });
  });

  describe('likeForumPost', () => {
    it('should like the post', async () => {
      const post = {
        userId: 'user123',
        likes: [],
        save: jest.fn()
      };
      ForumPost.findById.mockResolvedValue(post);
      const res = await request(app).post('/api/forum/1/like');
      expect(res.status).toBe(200);
      expect(post.likes).toContain('user123');
    });

    it('should not allow duplicate likes', async () => {
      const post = {
        likes: ['user123'],
        save: jest.fn()
      };
      ForumPost.findById.mockResolvedValue(post);
      const res = await request(app).post('/api/forum/1/like');
      expect(res.status).toBe(400);
    });
  });

  describe('addComment', () => {
    it('should add a comment', async () => {
      const post = {
        comments: [],
        save: jest.fn(),
      };
      ForumPost.findById.mockResolvedValue(post);
      const res = await request(app).post('/api/forum/1/comment').send({ text: 'komment' });
      expect(res.status).toBe(200);
      expect(post.comments.length).toBe(1);
    });

    it('should return 400 if text missing', async () => {
      const res = await request(app).post('/api/forum/1/comment').send({});
      expect(res.status).toBe(400);
    });
  });

  describe('updateComment', () => {
    it('should update comment text if owner', async () => {
      const comment = { userId: 'user123', text: '', toString: () => 'user123' };
      const post = {
        comments: { id: () => comment },
        save: jest.fn()
      };
      ForumPost.findById.mockResolvedValue(post);
      const res = await request(app).put('/api/forum/1/comment').send({
        commentId: 'c1',
        text: 'új szöveg'
      });
      expect(res.status).toBe(200);
      expect(comment.text).toBe('új szöveg');
    });
  });

  describe('deleteComment', () => {
    it('should delete comment if owner', async () => {
      const comment = { userId: 'user123', deleteOne: jest.fn(), toString: () => 'user123' };
      const post = {
        comments: { id: () => comment },
        save: jest.fn()
      };
      ForumPost.findById.mockResolvedValue(post);
      const res = await request(app).delete('/api/forum/1/comment').send({ commentId: 'c1' });
      expect(res.status).toBe(200);
      expect(comment.deleteOne).toHaveBeenCalled();
    });

    it('should deny if not owner or admin', async () => {
      const comment = { userId: 'someone', deleteOne: jest.fn(), toString: () => 'someone' };
      const post = {
        comments: { id: () => comment },
        save: jest.fn()
      };
      ForumPost.findById.mockResolvedValue(post);
      const res = await request(app).delete('/api/forum/1/comment').send({ commentId: 'c1' });
      expect(res.status).toBe(403);
    });
  });
});
