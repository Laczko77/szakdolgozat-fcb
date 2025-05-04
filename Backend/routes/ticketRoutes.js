const express = require('express');
const router = express.Router();
const { createTicketOrder, getMyTickets } = require('../controllers/ticketController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, createTicketOrder);
router.get('/my', authenticateToken, getMyTickets);

module.exports = router;
