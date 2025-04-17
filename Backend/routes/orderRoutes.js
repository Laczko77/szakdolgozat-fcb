const express = require('express');
const router = express.Router();
const { placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, placeOrder);
router.get('/', authMiddleware, getUserOrders);
router.get('/all', authMiddleware, getAllOrders);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
