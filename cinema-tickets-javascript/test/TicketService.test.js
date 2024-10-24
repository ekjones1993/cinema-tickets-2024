import TicketService from '../src/pairtest/TicketService';

jest.mock('../src/pairtest/lib/validation');

import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';
import { accountIDValidation } from '../src/pairtest/lib/validation';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TicketService', () => {
  describe('purchaseTickets', () => {
    test('Should throw InvalidPurchaseException when accountID is invalid', () => {
      // Mock the accountIDValidation function to return an error message
      accountIDValidation.mockReturnValue('Invalid account ID');

      const ticketService = new TicketService();
      const accountId = 0; // Invalid account ID

      expect(() => {
        ticketService.purchaseTickets(accountId);
      }).toThrowError(new InvalidPurchaseException('Invalid account ID'));
    });
  });
});
