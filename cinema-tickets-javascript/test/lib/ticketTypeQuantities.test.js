import { sortTicketTypeQuantities } from '../../src/pairtest/lib/ticketTypeQuantities';

describe('sortTicketTypeQuantities Tests', () => {
  test('returns the correct ticket type quantities', () => {
    const ticketTypeRequests = [
      { ticketType: 'ADULT', numOfTickets: 2 },
      { ticketType: 'CHILD', numOfTickets: 1 },
      { ticketType: 'INFANT', numOfTickets: 2 },
    ];

    const result = sortTicketTypeQuantities(ticketTypeRequests);

    expect(result).toEqual({
      ADULT: 2,
      CHILD: 1,
      INFANT: 2,
    });
  });

  test('returns zero quantities when ticketTypeRequests is empty', () => {
    const ticketTypeRequests = [];

    const result = sortTicketTypeQuantities(ticketTypeRequests);

    expect(result).toEqual({
      ADULT: 0,
      CHILD: 0,
      INFANT: 0,
    });
  });

  test('returns zero quantities when no tickets of a specific type are present', () => {
    const ticketTypeRequests = [
      { ticketType: 'ADULT', numOfTickets: 0 },
      { ticketType: 'CHILD', numOfTickets: 0 },
      { ticketType: 'INFANT', numOfTickets: 0 },
    ];

    const result = sortTicketTypeQuantities(ticketTypeRequests);

    expect(result).toEqual({
      ADULT: 0,
      CHILD: 0,
      INFANT: 0,
    });
  });
});
