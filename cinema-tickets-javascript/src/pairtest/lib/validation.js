export function accountIDValidation(accountID) {
  let error;

  if (!accountID || accountID <= 0) {
    error = 'AccountID is required and must be greater than 0';
  } else if (!Number.isInteger(accountID)) {
    error = 'AccountID is required to be an integer';
  }

  return error;
}
