import { TICKET_CONFIG } from '../data/ticketConfig';
/**
 * Immutable Object.
 */

export default class TicketTypeRequest {
  #type;

  #noOfTickets;

  constructor(type, noOfTickets) {
    // See if type exists as a key in the TICKET_CONFIG
    if (!(type in TICKET_CONFIG)) {
      throw new TypeError(
        `type must be one of: ${Object.keys(TICKET_CONFIG).join(', ')}`
      );
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError('noOfTickets must be an integer');
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }
}
