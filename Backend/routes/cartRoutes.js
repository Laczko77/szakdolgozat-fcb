const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  decreaseQuantity
} = require('../controllers/cartController');

// (később ide jöhet: const authMiddleware = require('../middlewares/auth');)
// router.use(authMiddleware); // ha lesz tokenes védelem
const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);
router.get('/', getCart);                     // GET /api/cart
router.post('/', addToCart);                 // POST /api/cart
router.delete('/:productId', removeFromCart); // DELETE /api/cart/:productId
router.delete('/', clearCart);               // DELETE /api/cart
router.post('/decrease', decreaseQuantity);

module.exports = router;
