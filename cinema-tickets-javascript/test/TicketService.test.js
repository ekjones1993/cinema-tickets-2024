import TicketService from '../src/pairtest/TicketService';

jest.mock('../src/pairtest/lib/validation');

import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';
import {
  accountIDValidation,
  ticketTypeRequestsValidation,
  ticketTypeQuantitiesValidation,
} from '../src/pairtest/lib/validation';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TicketService Tests', () => {
  describe('purchaseTickets Tests', () => {
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

    test('Should throw InvalidPurchaseException when ticketTypeQuantities are invalid', () => {
      // Mock the accountIDValidation and ticketTypeRequestsValidation functions to return null
      accountIDValidation.mockReturnValue(null);
      ticketTypeRequestsValidation.mockReturnValue(null);

      // Mock the ticketTypeQuantitiesValidation function to return an error message
      ticketTypeQuantitiesValidation.mockReturnValue(
        'Invalid ticket type quantities'
      );

      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [{ type: 'ADULT', quantity: 40 }];

      expect(() => {
        ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
      }).toThrowError(
        new InvalidPurchaseException('Invalid ticket type quantities')
      );
    });
  });
});
