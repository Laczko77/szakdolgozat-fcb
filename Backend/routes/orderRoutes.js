const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, placeOrder);
router.get('/', authenticateToken, getUserOrders);

// Admin-only
router.get('/all', authenticateToken, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteOrder);

module.exports = router;
