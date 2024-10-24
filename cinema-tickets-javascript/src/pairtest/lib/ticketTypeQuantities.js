import { TICKET_CONFIG } from '../data/ticketConfig';

export function sortTicketTypeQuantities(ticketTypeRequests) {
  // Initialise dynamic object with ticket types from TICKET_CONFIG counts set to 0
  const ticketTypeQuantities = Object.keys(TICKET_CONFIG).reduce(
    (quantities, type) => {
      quantities[type] = 0;
      return quantities;
    },
    {}
  );

  //For...of loop to iterate over each ticket in the ticketTypeRequests array
  for (const ticket of ticketTypeRequests) {
    //Destructure ticket object to extract the ticketType and numOfTickets properties
    const { ticketType, numOfTickets } = ticket;
    //Increment ticketType count in ticketTypeQuantities object based ticketType and numOfTickets values
    ticketTypeQuantities[ticketType] += numOfTickets;
  }

  return ticketTypeQuantities;
}
