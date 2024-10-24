import { TICKET_CONFIG } from '../data/ticketConfig'; // Adjust the path as necessary
import TicketTypeRequest from './TicketTypeRequest';

export function accountIDValidation(accountID) {
  let error;

  if (!accountID || accountID <= 0) {
    error = 'AccountID is required and must be greater than 0';
  } else if (!Number.isInteger(accountID)) {
    error = 'AccountID is required to be an integer';
  }

  return error;
}

export function ticketTypeRequestsValidation(ticketTypeRequests) {
  let error;

  // Check if any invalid ticket type request in ticketTypeRequests array
  const isInvalidTicketTypeRequest = ticketTypeRequests.some((ticket) => {
    // Validate ticket is instance of TicketTypeRequest
    if (!(ticket instanceof TicketTypeRequest)) {
      return true; // Invalid: not an instance
    }

    // Validate ticket type against TICKET_CONFIG
    const ticketType = ticket.getTicketType();
    return !Object.keys(TICKET_CONFIG).includes(ticketType); // Invalid: not in TICKET_CONFIG
  });

  if (isInvalidTicketTypeRequest) {
    error = 'Invalid ticket type request';
  }

  return error;
}
