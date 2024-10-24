import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import {
  accountIDValidation,
  ticketTypeRequestsValidation,
  ticketTypeQuantitiesValidation,
} from './lib/validation.js';
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
      this.#validateAccount(accountId);
      this.#validateTicketRequests(ticketTypeRequests);
      const ticketTypeQuantities = sortTicketTypeQuantities(ticketTypeRequests);
      this.#validateTicketQuantities(ticketTypeQuantities);
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
}
