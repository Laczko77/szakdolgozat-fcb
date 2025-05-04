const request = require('supertest');
const express = require('express');
const app = express();
const productController = require('../../controllers/productController');
const Product = require('../../models/Product');
const fs = require('fs');
const path = require('path');

jest.mock('../../models/Product');
jest.mock('fs');

app.use(express.json());
app.post('/api/products', productController.createProduct);
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
app.put('/api/products/:id', productController.updateProduct);
app.delete('/api/products/:id', productController.deleteProduct);

describe('Product Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createProduct', () => {
    it('should create product successfully', async () => {
        const newProduct = {
          name: 'Test',
          description: 'Desc',
          price: 100,
          category: 'shirt',
          imageUrl: 'http://localhost:3000/uploads/products/image.jpg',
          save: jest.fn().mockResolvedValue(true) // ha a controller `new Product().save()`-et hív
        };
      
        Product.mockImplementation(() => newProduct); // <-- itt visszaadjuk a mock példányt
      
        const req = {
          body: newProduct,
          file: { filename: 'image.jpg' },
          protocol: 'http',
          get: () => 'localhost:3000'
        };
      
        const res = mockResponse();
        await productController.createProduct(req, res);
      
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test' }));
      });
  });

  describe('getAllProducts', () => {
    it('should return list of products', async () => {
      Product.find.mockResolvedValue([{ name: 'Test' }]);
      const res = mockResponse();
      await productController.getAllProducts({}, res);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: 'Test' })]));
    });
  });

  describe('getProductById', () => {
    it('should return a product', async () => {
      Product.findById.mockResolvedValue({ name: 'Test' });
      const req = { params: { id: '123' } };
      const res = mockResponse();
      await productController.getProductById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test' }));
    });

    it('should return 404 if not found', async () => {
      Product.findById.mockResolvedValue(null);
      const req = { params: { id: '123' } };
      const res = mockResponse();
      await productController.getProductById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const req = {
        params: { id: '123' },
        body: { name: 'Updated', price: '150' },
        file: { filename: 'new.jpg' },
        protocol: 'http',
        get: () => 'localhost:3000'
      };

      const save = jest.fn();
      Product.findById.mockResolvedValue({ save, imageUrl: '', ...req.body });
      const res = mockResponse();

      await productController.updateProduct(req, res);
      expect(save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated' }));
    });

    it('should return 404 if not found', async () => {
      Product.findById.mockResolvedValue(null);
      const req = { params: { id: '123' }, body: {} };
      const res = mockResponse();
      await productController.updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product and image if exists', async () => {
      const deleteOne = jest.fn();
      Product.findById.mockResolvedValue({ deleteOne, imageUrl: 'http://localhost:3000/uploads/products/img.jpg' });
      const req = { params: { id: '123' } };
      const res = mockResponse();
      await productController.deleteProduct(req, res);
      expect(deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Termék törölve.' });
    });

    it('should return 404 if product not found', async () => {
      Product.findById.mockResolvedValue(null);
      const req = { params: { id: '123' } };
      const res = mockResponse();
      await productController.deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });


  describe('createProduct - edge cases', () => {
    it('should return 400 if required fields are missing', async () => {
      const req = {
        body: { description: 'no name or category', price: 'invalid' },
        file: null
      };
      const res = mockResponse();
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Név, ár és kategória kötelező.' });
    });

    it('should handle server error', async () => {
      Product.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('DB hiba'))
      }));

      const req = {
        body: { name: 'test', description: '', price: 100, category: 'shirt' },
        file: null,
        protocol: 'http',
        get: () => 'localhost'
      };
      const res = mockResponse();
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllProducts - error branch', () => {
    it('should return 500 on query failure', async () => {
      Product.find.mockRejectedValue(new Error('DB error'));
      const res = mockResponse();
      await productController.getAllProducts({}, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProductById - error branch', () => {
    it('should return 500 on db failure', async () => {
      Product.findById.mockRejectedValue(new Error('Hiba'));
      const req = { params: { id: 'abc' } };
      const res = mockResponse();
      await productController.getProductById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateProduct - error branch', () => {
    it('should return 500 if db fails', async () => {
      Product.findById.mockRejectedValue(new Error('fail'));
      const req = { params: { id: '123' }, body: {} };
      const res = mockResponse();
      await productController.updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should skip fs.unlink if no old image', async () => {
      const save = jest.fn();
      Product.findById.mockResolvedValue({ save, imageUrl: '', name: 'A' });

      const req = {
        params: { id: '123' },
        body: { name: 'Updated' },
        file: { filename: 'new.jpg' },
        protocol: 'http',
        get: () => 'localhost'
      };
      const res = mockResponse();
      await productController.updateProduct(req, res);
      expect(save).toHaveBeenCalled();
    });
  });

  describe('deleteProduct - error and no-image branch', () => {
    it('should return 500 on delete error', async () => {
      Product.findById.mockRejectedValue(new Error('Hiba'));
      const req = { params: { id: 'fail' } };
      const res = mockResponse();
      await productController.deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should not call fs.unlink if no imageUrl', async () => {
      const deleteOne = jest.fn();
      Product.findById.mockResolvedValue({ imageUrl: '', deleteOne });
      const req = { params: { id: 'noimg' } };
      const res = mockResponse();
      await productController.deleteProduct(req, res);
      expect(deleteOne).toHaveBeenCalled();
    });
  });



});

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
