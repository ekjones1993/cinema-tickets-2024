import {
  accountIDValidation,
  ticketTypeRequestsValidation,
  ticketTypeQuantitiesValidation,
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

  describe('ticketTypeQuantities Validation Tests', () => {
    test('Should not error when ticket quantities are valid', () => {
      const ticketQuantities = {
        ADULT: 2,
        CHILD: 1,
        INFANT: 1,
      };

      expect(ticketTypeQuantitiesValidation(ticketQuantities)).toBeUndefined();
    });

    test('Should error when total ticket quantity is less than 1', () => {
      const ticketQuantities = {
        ADULT: 0,
        CHILD: 0,
        INFANT: 0,
      };

      expect(ticketTypeQuantitiesValidation(ticketQuantities)).toBe(
        'Ticket quantity must be between 1-25'
      );
    });

    test('Should error when total ticket quantity is greater than 25', () => {
      const ticketQuantities = {
        ADULT: 15,
        CHILD: 15,
        INFANT: 5,
      };

      expect(ticketTypeQuantitiesValidation(ticketQuantities)).toBe(
        'Ticket quantity must be between 1-25'
      );
    });

    test('Should error when no adult tickets are purchased', () => {
      const ticketQuantities = {
        ADULT: 0,
        CHILD: 2,
        INFANT: 0,
      };

      expect(ticketTypeQuantitiesValidation(ticketQuantities)).toBe(
        'At least one adult ticket must be purchased to buy child tickets'
      );
    });

    test('Should error when infant tickets are more than adult tickets', () => {
      const ticketQuantities = {
        ADULT: 2,
        CHILD: 3,
        INFANT: 4,
      };

      expect(ticketTypeQuantitiesValidation(ticketQuantities)).toBe(
        'One adult ticket must be purchased for each infant ticket'
      );
    });
  });
});
