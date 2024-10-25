import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import SeatReservationService from '../../src/thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../../src/thirdparty/paymentgateway/TicketPaymentService';
import {
  accountIDValidation,
  ticketTypeRequestsValidation,
  ticketTypeQuantitiesValidation,
} from './lib/validation.js';
import { TICKET_CONFIG } from './data/ticketConfig.js';
import { sortTicketTypeQuantities } from './lib/ticketTypeQuantities.js';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating session ID
import logger, { setSessionId } from './lib/logger.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  constructor() {
    this.sessionId = uuidv4(); // Generate a unique session ID
    setSessionId(this.sessionId); // Set the session ID for logger
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    logger.info('Starting ticket purchase process', {
      sessionId: this.sessionId,
      ticketTypeRequests,
    });

    try {
      // Validate and sort inputs
      this.#validateAccount(accountId);
      this.#validateTicketRequests(ticketTypeRequests);
      const ticketTypeQuantities = sortTicketTypeQuantities(ticketTypeRequests);
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

  #validateTicketRequests(ticketTypeRequests) {
    const ticketTypeRequestError =
      ticketTypeRequestsValidation(ticketTypeRequests);
    if (ticketTypeRequestError) {
      logger.error('TICKET_TYPE_REQUEST_ERROR:', {
        error: ticketTypeRequestError,
      });
      throw new InvalidPurchaseException(ticketTypeRequestError);
    }
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
