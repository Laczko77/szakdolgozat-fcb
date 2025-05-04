const request = require('supertest');
const express = require('express');
const app = express();
const orderController = require('../../controllers/orderController');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');

jest.mock('../../models/Order');
jest.mock('../../models/Cart');

app.use(express.json());
app.post('/api/orders', (req, res) => {
  req.userId = 'user123';
  orderController.placeOrder(req, res);
});

app.get('/api/orders/user', (req, res) => {
  req.userId = 'user123';
  orderController.getUserOrders(req, res);
});

app.get('/api/orders/all', orderController.getAllOrders);
app.patch('/api/orders/:id/status', orderController.updateOrderStatus);
app.delete('/api/orders/:id', orderController.deleteOrder);

describe('Order Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('placeOrder', () => {
    it('should place an order successfully', async () => {
      const mockCart = {
        items: [
          {
            productId: { _id: 'p1', name: 'Termék', price: 100, imageUrl: '' },
            quantity: 2,
            size: 'M',
            player: { _id: 'pl1', name: 'Messi' }
          }
        ]
      };

      Cart.findOne.mockReturnValue(mockPopulateReturn(mockCart));
      Order.prototype.save = jest.fn();
      Order.findById.mockReturnValue(mockPopulateReturn({}));
      Cart.findOneAndUpdate.mockResolvedValue({});

      const req = { userId: 'user123' };
      const res = mockResponse();

      await orderController.placeOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String), order: expect.anything() })
      );
    });

    it('should return 400 if cart is empty', async () => {
      Cart.findOne.mockReturnValue(mockPopulateReturn({ items: [] }));
      const req = { userId: 'user123' };
      const res = mockResponse();

      await orderController.placeOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
        })
      });

      const req = { userId: 'user123' };
      const res = mockResponse();

      await orderController.getUserOrders(req, res);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
        })
      });

      const res = mockResponse();
      await orderController.getAllOrders({}, res);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const save = jest.fn();
      const mockOrder = { status: 'pending', save };
  
      Order.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockOrder)
      });
  
      const req = { params: { id: 'order123' }, body: { status: 'done' } };
      const res = mockResponse();
  
      await orderController.updateOrderStatus(req, res);
      expect(save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });
  
    it('should return 404 if order not found', async () => {
      Order.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      });
  
      const req = { params: { id: 'unknown' }, body: { status: 'done' } };
      const res = mockResponse();
  
      await orderController.updateOrderStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rendelés nem található' });
    });
  });
  
});

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockPopulateReturn(value) {
  return {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(value),
    ...value
  };
}
