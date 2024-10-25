import TicketService from '../src/pairtest/TicketService';

jest.mock('../src/pairtest/lib/validation');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService');
jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService');
jest.mock('../src/pairtest/lib/ticketTypeQuantities');

import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';
import {
  accountIDValidation,
  ticketTypeQuantitiesValidation,
} from '../src/pairtest/lib/validation';

import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TicketService Tests', () => {
  describe('purchaseTickets Unhappy Path Tests', () => {
    test('Should throw InvalidPurchaseException when accountID is invalid', () => {
      accountIDValidation.mockReturnValue('Invalid account ID');

      const ticketService = new TicketService();
      const accountId = 0;

      expect(() => {
        ticketService.purchaseTickets(accountId, []);
      }).toThrowError(new InvalidPurchaseException('Invalid account ID'));
    });

    test('Should throw TypeError when an invalid ticket type is passed', () => {
      accountIDValidation.mockReturnValue(null);

      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [{ type: 'INVALID_TYPE', noOfTickets: 1 }];

      expect(() => {
        ticketService.purchaseTickets(accountId, ticketTypeRequests);
      }).toThrowError(
        new InvalidPurchaseException(
          'Invalid ticket type request: type must be one of: ADULT, CHILD, INFANT'
        )
      );
    });

    test('Should throw TypeError when noOfTickets is not an integer', () => {
      accountIDValidation.mockReturnValue(null);

      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [{ type: 'ADULT', noOfTickets: 'two' }];

      expect(() => {
        ticketService.purchaseTickets(accountId, ticketTypeRequests);
      }).toThrowError(
        new InvalidPurchaseException(
          'Invalid ticket type request: noOfTickets must be an integer'
        )
      );
    });

    test('Should throw InvalidPurchaseException when ticketTypeQuantities are invalid', () => {
      accountIDValidation.mockReturnValue(null);
      ticketTypeQuantitiesValidation.mockReturnValue(
        'Invalid ticket type quantities'
      );

      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [{ type: 'ADULT', noOfTickets: 40 }];

      expect(() => {
        ticketService.purchaseTickets(accountId, ticketTypeRequests);
      }).toThrowError(
        new InvalidPurchaseException('Invalid ticket type quantities')
      );
    });
  });

  describe('purchaseTickets Happy Path Tests', () => {
    test('Should call SeatReservationService.reserveSeat and TicketPaymentService.makePayment with the correct parameters', () => {
      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [{ type: 'ADULT', noOfTickets: 2 }];
      const ticketTypeQuantities = { ADULT: 2 };
      const totalNumSeats = 2;
      const totalTicketCost = 50;

      accountIDValidation.mockReturnValue(null);
      ticketTypeQuantitiesValidation.mockReturnValue(null);

      SeatReservationService.prototype.reserveSeat = jest.fn();
      TicketPaymentService.prototype.makePayment = jest.fn();

      const result = ticketService.purchaseTickets(
        accountId,
        ticketTypeRequests
      );

      expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(
        accountId,
        totalNumSeats
      );
      expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(
        accountId,
        totalTicketCost
      );
      expect(result).toEqual({
        accountId,
        totalNumSeats,
        totalTicketCost,
        ...ticketTypeQuantities,
      });
    });

    test('Should process multiple ticket types correctly and return accurate results', () => {
      const ticketService = new TicketService();
      const accountId = 123;
      const ticketTypeRequests = [
        { type: 'ADULT', noOfTickets: 3 },
        { type: 'CHILD', noOfTickets: 1 },
        { type: 'INFANT', noOfTickets: 1 },
      ];
      const ticketTypeQuantities = { ADULT: 3, CHILD: 1, INFANT: 1 };

      accountIDValidation.mockReturnValue(null);
      ticketTypeQuantitiesValidation.mockReturnValue(null);

      SeatReservationService.prototype.reserveSeat = jest.fn();
      TicketPaymentService.prototype.makePayment = jest.fn();

      const result = ticketService.purchaseTickets(
        accountId,
        ticketTypeRequests
      );

      expect(result).toEqual({
        accountId,
        totalNumSeats: 4, // Only ADULT and CHILD tickets count as seats
        totalTicketCost: 90, // Assume costs: ADULT=30, CHILD=20, INFANT=0
        ...ticketTypeQuantities,
      });

      expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(
        accountId,
        4
      );
      expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(
        accountId,
        90
      );
    });
  });

  describe('Dynamic Ticket Type Example Test', () => {
    beforeEach(() => {
      jest.resetModules(); // Reset module registry before each test
    });

    test('Should handle a new VIP ticket type dynamically when added to TICKET_CONFIG', () => {
      jest.mock('../src/pairtest/data/ticketConfig', () => {
        const { TICKET_CONFIG } = jest.requireActual(
          '../src/pairtest/data/ticketConfig'
        );
        return {
          TICKET_CONFIG: {
            ...TICKET_CONFIG, // Include original ticket types
            VIP: 50, // Add new ticket type
          },
        };
      });

      // Re-import TicketService + TicketTypeRequest to use mocked config
      const TicketService = require('../src/pairtest/TicketService').default;
      const TicketTypeRequest =
        require('../src/pairtest/lib/TicketTypeRequest').default;

      const NEW_TICKET_TYPE = 'VIP';

      // Test TicketTypeRequest with new ticket type
      const vipTicketRequest = new TicketTypeRequest(NEW_TICKET_TYPE, 2);
      expect(vipTicketRequest.getTicketType()).toBe(NEW_TICKET_TYPE);
      expect(vipTicketRequest.getNoOfTickets()).toBe(2);

      // Test TicketService with new ticket type
      const ticketService = new TicketService();
      const accountId = 456;
      const ticketTypeRequests = [
        { type: 'ADULT', noOfTickets: 2 },
        { type: 'VIP', noOfTickets: 3 },
      ];

      const purchaseInfo = ticketService.purchaseTickets(
        accountId,
        ticketTypeRequests
      );

      expect(purchaseInfo).toEqual({
        accountId: 456,
        totalNumSeats: 5, // ADULT (2) + VIP (3)
        ADULT: 2,
        VIP: 3,
        totalTicketCost: 2 * 25 + 3 * 50,
      });
    });
  });
});
