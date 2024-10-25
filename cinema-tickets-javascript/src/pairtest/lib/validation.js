export function accountIDValidation(accountID) {
  let error;

  if (!accountID || accountID <= 0) {
    error = 'AccountID is required and must be greater than 0';
  } else if (!Number.isInteger(accountID)) {
    error = 'AccountID is required to be an integer';
  }

  return error;
}

export function ticketTypeQuantitiesValidation(ticketTypeQuantities) {
  let error;

  // Dynamically calculate the total number of tickets
  // const totalNumTicketsRequested = Object.values(ticketTypeQuantities).reduce((total, quantity) => total + quantity, 0);
  const totalNumTicketsRequested = Object.values(ticketTypeQuantities).reduce(
    (total, quantity) =>
      total + (typeof quantity === 'number' && quantity > 0 ? quantity : 0),
    0
  );

  // General validation for total ticket count
  if (totalNumTicketsRequested === 0 || totalNumTicketsRequested > 25) {
    error = 'Ticket quantity must be between 1-25';
    return error;
  }

  // Validation: At least one adult ticket must be purchased if child tickets are present
  if (!ticketTypeQuantities.ADULT && ticketTypeQuantities.CHILD >= 1) {
    error = 'At least one adult ticket must be purchased to buy child tickets';
    return error;
  }

  // Validation: One adult ticket per infant ticket
  if (ticketTypeQuantities.INFANT > ticketTypeQuantities.ADULT) {
    error = 'One adult ticket must be purchased for each infant ticket';
    return error;
  }

  // No errors
  return error;
}
