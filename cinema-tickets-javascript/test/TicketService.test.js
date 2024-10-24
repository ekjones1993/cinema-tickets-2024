import TicketService from '../src/pairtest/TicketService';

jest.mock('../src/pairtest/lib/validation');

import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';
import {
  accountIDValidation,
  ticketTypeRequestsValidation,
} from '../src/pairtest/lib/validation';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TicketService Tests', () => {
  describe('purchaseTickets', () => {
    test('Should throw InvalidPurchaseException when accountID is invalid', () => {
      // Mock accountIDValidation function to return an error message
      accountIDValidation.mockReturnValue('Invalid account ID');

      const ticketService = new TicketService();
      const accountId = 0; // Invalid account ID

      expect(() => {
        ticketService.purchaseTickets(accountId);
      }).toThrowError(new InvalidPurchaseException('Invalid account ID'));
    });
    test('Should throw InvalidPurchaseException when ticketTypeRequests are invalid', () => {
      // Mock accountIDValidation function to return null
      accountIDValidation.mockReturnValue(null);
      // Mock ticketTypeRequestsValidation function to return an error message
      ticketTypeRequestsValidation.mockReturnValue(
        'Invalid ticket type requests'
      );

      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [{ type: 'invalid' }]; // Invalid ticket type requests

      expect(() => {
        ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
      }).toThrowError(
        new InvalidPurchaseException('Invalid ticket type requests')
      );
    });
  });
});
