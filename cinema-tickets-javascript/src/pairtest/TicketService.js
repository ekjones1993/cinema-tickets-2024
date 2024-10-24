import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import { accountIDValidation } from './lib/validation.js';
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
    } catch (error) {
      logger.error('Ticket purchase failed', { error: error.message });
      throw new InvalidPurchaseException(error.message);
    }
  }

  #validateAccount(accountId) {
    const accountIDError = accountIDValidation(accountId);
    if (accountIDError) {
      logger.error('Invalid account ID', { error: accountIDError });
      throw new InvalidPurchaseException(accountIDError);
    }
  }
}
