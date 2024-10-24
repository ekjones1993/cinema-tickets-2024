import {
  accountIDValidation,
  ticketTypeRequestsValidation,
} from '../../src/pairtest/lib/validation';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest'; // Adjust the path as necessary

describe('Validation Tests', () => {
  describe('accountID Validation Tests', () => {
    test('Should error when accountID is null', () => {
      expect(accountIDValidation(null)).toBe(
        'AccountID is required and must be greater than 0'
      );
    });
    test('Should error when accountID is 0', () => {
      expect(accountIDValidation(0)).toBe(
        'AccountID is required and must be greater than 0'
      );
    });
    test('Should return error when accountID is not an integer', () => {
      expect(accountIDValidation('9')).toBe(
        'AccountID is required to be an integer'
      );
    });
  });

  describe('ticketTypeRequests Validation Tests', () => {
    test("Should error when ticketTypeRequests contains invalid type that isn't in TICKET_CONFIG", () => {
      const ticketTypeRequests = [
        new TicketTypeRequest('ADULT', 2),
        new TicketTypeRequest('CHILD', 1),
        { type: 'INVALID', quantity: 3 },
      ];

      expect(ticketTypeRequestsValidation(ticketTypeRequests)).toBe(
        'Invalid ticket type request'
      );
    });

    test('Should not error when ticketTypeRequests are valid', () => {
      const ticketTypeRequests = [
        new TicketTypeRequest('ADULT', 2),
        new TicketTypeRequest('CHILD', 1),
        new TicketTypeRequest('INFANT', 1),
      ];

      expect(ticketTypeRequestsValidation(ticketTypeRequests)).toBe(undefined);
    });
  });
});
