const express = require('express');
const router = express.Router();
const { createTicketOrder, getMyTickets } = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createTicketOrder);
router.get('/my', authMiddleware, getMyTickets);

module.exports = router;
