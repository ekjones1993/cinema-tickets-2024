import TicketService from '../src/pairtest/TicketService';

jest.mock('../src/pairtest/lib/validation');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService');
jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService');
jest.mock('../src/pairtest/lib/ticketTypeQuantities');

import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';
import {
  accountIDValidation,
  ticketTypeRequestsValidation,
  ticketTypeQuantitiesValidation,
} from '../src/pairtest/lib/validation';

import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService';
import { sortTicketTypeQuantities } from '../src/pairtest/lib/ticketTypeQuantities';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TicketService Tests', () => {
  describe('purchaseTickets Unhappy Path Tests', () => {
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
  describe('purchaseTickets happy Path Tests', () => {
    test('Should call SeatReservationService.reserveSeat and TicketPaymentService.makePayment with the correct parameters', () => {
      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [{ type: 'adult', quantity: 2 }];
      const ticketTypeQuantities = { ADULT: 2 };
      const totalNumSeats = 2;
      const totalTicketCost = 50;

      // Mock the validation functions to return null
      accountIDValidation.mockReturnValue(null);
      ticketTypeRequestsValidation.mockReturnValue(null);
      ticketTypeQuantitiesValidation.mockReturnValue(null);

      // Mock the sortTicketTypeQuantities function to return the valid ticketTypeQuantities
      sortTicketTypeQuantities.mockReturnValue(ticketTypeQuantities);

      // Mock the SeatReservationService.reserveSeat and TicketPaymentService.makePayment methods
      SeatReservationService.prototype.reserveSeat = jest.fn();
      TicketPaymentService.prototype.makePayment = jest.fn();

      ticketService.purchaseTickets(accountId, ...ticketTypeRequests);

      expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(
        accountId,
        totalNumSeats
      );
      expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(
        accountId,
        totalTicketCost
      );
    });

    test('Should return the correct purchase information', () => {
      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [
        { type: 'adult', quantity: 3 },
        { type: 'child', quantity: 1 },
        { type: 'infant', quantity: 1 },
      ];
      const ticketTypeQuantities = { ADULT: 3, CHILD: 1, INFANT: 1 };

      // Mock the validation functions to return null
      accountIDValidation.mockReturnValue(null);
      ticketTypeRequestsValidation.mockReturnValue(null);
      ticketTypeQuantitiesValidation.mockReturnValue(null);

      // Mock the sortTicketTypeQuantities function to return the valid ticketTypeQuantities
      sortTicketTypeQuantities.mockReturnValue(ticketTypeQuantities);

      // Mock the SeatReservationService.reserveSeat and TicketPaymentService.makePayment methods
      SeatReservationService.prototype.reserveSeat = jest.fn();
      TicketPaymentService.prototype.makePayment = jest.fn();

      const purchaseInfo = ticketService.purchaseTickets(
        accountId,
        ...ticketTypeRequests
      );

      expect(purchaseInfo).toEqual({
        accountId: 123,
        totalNumSeats: 4,
        ...ticketTypeQuantities,
        totalTicketCost: 90,
      });
    });
  });
});
