const ticketController = require('../../controllers/ticketController');
const Ticket = require('../../models/Ticket');

jest.mock('../../models/Ticket');

describe('Ticket Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createTicketOrder', () => {
    it('should create a ticket order successfully', async () => {
      const mockTicket = {
        save: jest.fn().mockResolvedValue(true)
      };
      Ticket.mockImplementation(() => mockTicket);

      const req = {
        userId: 'user123',
        body: {
          matchId: 'match123',
          tickets: { A: 2, B: 1 }
        }
      };
      const res = mockResponse();

      await ticketController.createTicketOrder(req, res);

      expect(mockTicket.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTicket);
    });

    it('should handle errors on createTicketOrder', async () => {
      Ticket.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('hiba'))
      }));

      const req = {
        userId: 'user123',
        body: {
          matchId: 'match123',
          tickets: { A: 1 }
        }
      };
      const res = mockResponse();

      await ticketController.createTicketOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Jegyrendelés sikertelen' }));
    });
  });

  describe('getMyTickets', () => {
    it('should return user tickets', async () => {
      const mockPopulate = {
        populate: jest.fn().mockResolvedValue([{ matchId: 'match1' }])
      };
      Ticket.find.mockReturnValue(mockPopulate);

      const req = { userId: 'user123' };
      const res = mockResponse();

      await ticketController.getMyTickets(req, res);

      expect(Ticket.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(res.json).toHaveBeenCalledWith([{ matchId: 'match1' }]);
    });

    it('should handle errors on getMyTickets', async () => {
      Ticket.find.mockImplementation(() => ({
        populate: jest.fn().mockRejectedValue(new Error('hiba'))
      }));

      const req = { userId: 'user123' };
      const res = mockResponse();

      await ticketController.getMyTickets(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Nem sikerült lekérni a jegyrendeléseket' }));
    });
  });
});

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
