const request = require('supertest');
const express = require('express');
const cartController = require('../../controllers/cartController');
const Cart = require('../../models/Cart');

jest.mock('../../models/Cart');

const app = express();
app.use(express.json());

function mockAuth(req, res, next) {
  req.user = { _id: 'user123' };
  req.userId = 'user123';
  next();
}

app.get('/api/cart', mockAuth, cartController.getCart);
app.post('/api/cart/add', mockAuth, cartController.addToCart);
app.post('/api/cart/remove', mockAuth, cartController.removeFromCart);
app.delete('/api/cart/clear', mockAuth, cartController.clearCart);
app.post('/api/cart/decrease', mockAuth, cartController.decreaseQuantity);

describe('Cart Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getCart', () => {
    it('should return empty items if cart not found', async () => {
      Cart.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const res = await request(app).get('/api/cart');
      expect(res.body).toEqual({ items: [] });
    });

    it('should return populated cart', async () => {
      const cart = { items: [{ productId: 'p1' }] };
      Cart.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(cart)
      });

      const res = await request(app).get('/api/cart');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(cart);
    });
  });

  describe('addToCart', () => {
    it('should create new cart and add item', async () => {
      const cartMock = {
        items: [],
        save: jest.fn().mockResolvedValue(),
        populate: jest.fn().mockResolvedValue({ items: [{ productId: 'p1' }] })
      };
      Cart.findOne.mockResolvedValue(null);
      Cart.mockImplementation(() => cartMock);

      const res = await request(app).post('/api/cart/add').send({
        productId: 'p1',
        quantity: 1,
        size: 'M'
      });
      expect(res.status).toBe(201);
    });

    it('should increase quantity of existing item', async () => {
      const cartMock = {
        items: [{ productId: 'p1', size: 'M', quantity: 1, player: null }],
        save: jest.fn().mockResolvedValue(),
        populate: jest.fn().mockResolvedValue({ items: [{ productId: 'p1', quantity: 2 }] })
      };
      Cart.findOne.mockResolvedValue(cartMock);

      const res = await request(app).post('/api/cart/add').send({
        productId: 'p1',
        quantity: 1,
        size: 'M'
      });
      expect(res.status).toBe(201);
    });
  });

  describe('removeFromCart', () => {
    it('should remove matching item', async () => {
      const cart = {
        items: [
          { productId: 'p1', size: 'M', player: null },
          { productId: 'p2', size: 'L', player: null }
        ],
        save: jest.fn().mockResolvedValue(),
        populate: jest.fn().mockResolvedValue({ items: [{ productId: 'p2' }] })
      };
      Cart.findOne.mockResolvedValue(cart);

      const res = await request(app).post('/api/cart/remove').send({
        productId: 'p1',
        size: 'M'
      });
      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('should clear all items in cart', async () => {
      const cart = { items: ['valami'], save: jest.fn().mockResolvedValue() };
      Cart.findOne.mockResolvedValue(cart);

      const res = await request(app).delete('/api/cart/clear');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Kosár kiürítve');
      expect(cart.items.length).toBe(0);
    });
  });

  describe('decreaseQuantity', () => {
    it('should decrease item quantity if > 1', async () => {
      const cart = {
        items: [{ productId: 'p1', size: 'M', quantity: 2, player: null }],
        save: jest.fn().mockResolvedValue()
      };
      Cart.findOne.mockResolvedValue(cart);

      const res = await request(app).post('/api/cart/decrease').send({
        productId: 'p1',
        size: 'M'
      });

      expect(res.status).toBe(200);
      expect(cart.items[0].quantity).toBe(1);
    });

    it('should remove item if quantity = 1', async () => {
      const cart = {
        items: [{ productId: 'p1', size: 'M', quantity: 1, player: null }],
        save: jest.fn().mockResolvedValue()
      };
      Cart.findOne.mockResolvedValue(cart);

      const res = await request(app).post('/api/cart/decrease').send({
        productId: 'p1',
        size: 'M'
      });

      expect(res.status).toBe(200);
      expect(cart.items.length).toBe(0);
    });
  });
});
