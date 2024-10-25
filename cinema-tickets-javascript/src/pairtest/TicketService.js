import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import SeatReservationService from '../../src/thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../../src/thirdparty/paymentgateway/TicketPaymentService';
import {
  accountIDValidation,
  ticketTypeQuantitiesValidation,
} from './lib/validation.js';
import { TICKET_CONFIG } from './data/ticketConfig.js';
import { v4 as uuidv4 } from 'uuid';
import logger, { setSessionId } from './lib/logger.js';
import TicketTypeRequest from './lib/TicketTypeRequest';

export default class TicketService {
  constructor() {
    this.sessionId = uuidv4(); // Generate unique session ID
    setSessionId(this.sessionId); // Set session ID for logger
  }

  purchaseTickets(accountId, ticketTypeRequests) {
    logger.info('Starting ticket purchase process', {
      sessionId: this.sessionId,
      ticketTypeRequests,
    });

    try {
      // Validate account ID
      this.#validateAccount(accountId);

      // Turn input objects into TicketTypeRequest instances
      const ticketTypeRequestsInstances =
        this.#createTicketTypeRequests(ticketTypeRequests);

      // Turn TicketTypeRequest instances into ticketTypeQuantities
      const ticketTypeQuantities = this.#processTicketRequests(
        ticketTypeRequestsInstances
      );

      // Validate ticket quantities
      this.#validateTicketQuantities(ticketTypeQuantities);

      // Calculate seats and total cost
      const totalNumSeats = this.#calculateTotalSeats(ticketTypeQuantities);
      const totalTicketCost =
        this.#calculateTotalTicketCost(ticketTypeQuantities);

      logger.info('Calculated total seats and cost', {
        totalNumSeats,
        totalTicketCost,
      });

      // Book seats and pay
      this.#bookSeatsAndPay(accountId, totalNumSeats, totalTicketCost);

      logger.info('Ticket purchase successful', {
        totalNumSeats,
        totalTicketCost,
      });

      return {
        accountId,
        totalNumSeats,
        totalTicketCost,
        ...ticketTypeQuantities,
      };
    } catch (error) {
      logger.error('PURCHASE_TICKETS_ERROR:', { error: error.message });
      throw new InvalidPurchaseException(error.message);
    }
  }

  #validateAccount(accountId) {
    const accountIDError = accountIDValidation(accountId);
    if (accountIDError) {
      logger.error('ACCOUNT_ID_ERROR:', { error: accountIDError });
      throw new InvalidPurchaseException(accountIDError);
    }
  }

  #createTicketTypeRequests(ticketTypeRequests) {
    return ticketTypeRequests.map(({ type, noOfTickets }) => {
      try {
        return new TicketTypeRequest(type, noOfTickets);
      } catch (error) {
        logger.error('TICKET_TYPE_REQUEST_CREATION_ERROR', {
          type,
          noOfTickets,
          error: error.message,
        });
        throw new InvalidPurchaseException(
          `Invalid ticket type request: ${error.message}`
        );
      }
    });
  }

  #processTicketRequests(ticketTypeRequestsInstances) {
    return ticketTypeRequestsInstances.reduce((quantities, request) => {
      const type = request.getTicketType();
      const noOfTickets = request.getNoOfTickets();

      if (!quantities[type]) {
        quantities[type] = 0;
      }

      quantities[type] += noOfTickets;
      return quantities;
    }, {});
  }

  #validateTicketQuantities(ticketTypeQuantities) {
    const ticketTypeQuantitiesError =
      ticketTypeQuantitiesValidation(ticketTypeQuantities);
    if (ticketTypeQuantitiesError) {
      logger.error('TICKET_TYPE_QUANTITIES_ERROR:', {
        error: ticketTypeQuantitiesError,
      });
      throw new InvalidPurchaseException(ticketTypeQuantitiesError);
    }
  }

  #calculateTotalSeats(ticketTypeQuantities) {
    return Object.entries(ticketTypeQuantities).reduce(
      (totalSeats, [type, quantity]) => {
        // Only count non-infant tickets
        if (type.toUpperCase() !== 'INFANT') {
          return totalSeats + quantity;
        }
        return totalSeats;
      },
      0
    );
  }

  #calculateTotalTicketCost(ticketTypeQuantities) {
    return Object.entries(ticketTypeQuantities).reduce(
      (total, [type, quantity]) => {
        const costPerTicket = TICKET_CONFIG[type.toUpperCase()];
        return total + costPerTicket * quantity;
      },
      0
    );
  }

  #bookSeatsAndPay(accountId, totalNumSeats, totalTicketCost) {
    try {
      logger.info('Reserving seats', { totalNumSeats });

      const seatReservationService = new SeatReservationService();
      seatReservationService.reserveSeat(accountId, totalNumSeats);

      logger.info('Processing payment', { totalTicketCost });

      const ticketPaymentService = new TicketPaymentService();
      ticketPaymentService.makePayment(accountId, totalTicketCost);

      logger.info('Payment successful');
    } catch (error) {
      logger.error('BOOK_AND_PAY_ERROR', { error: error.message });
      throw new Error('Book seats or payment failed: ' + error.message);
    }
  }
}
