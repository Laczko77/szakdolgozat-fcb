const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  decreaseQuantity
} = require('../controllers/cartController');


const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.get('/', getCart);                     // GET /api/cart
router.post('/', addToCart);                 // POST /api/cart
router.post('/remove', removeFromCart);
router.delete('/:productId', removeFromCart); // DELETE /api/cart/:productId
router.delete('/', clearCart);               // DELETE /api/cart
router.post('/decrease', decreaseQuantity);

module.exports = router;
