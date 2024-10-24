import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import { accountIDValidation } from './lib/validation.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // Validate accountId, throw exception if invalid.
    const accountIDError = accountIDValidation(accountId);

    if (accountIDError) {
      throw new InvalidPurchaseException(accountIDError);
    }
  }
}
