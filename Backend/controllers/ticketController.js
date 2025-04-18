const Ticket = require('../models/Ticket');

const createTicketOrder = async (req, res) => {
  try {
    const { matchId, tickets } = req.body;

    const newOrder = new Ticket({
      userId: req.userId,
      matchId,
      tickets
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Jegyrendelés sikertelen', error: err });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.userId }).populate('matchId');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Nem sikerült lekérni a jegyrendeléseket', error: err });
  }
};

module.exports = {
  createTicketOrder,
  getMyTickets
};
