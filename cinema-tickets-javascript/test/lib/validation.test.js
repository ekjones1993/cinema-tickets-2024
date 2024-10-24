import { accountIDValidation } from '../../src/pairtest/lib/validation';

describe('Validation Tests', () => {
  describe('accountID Validation Tests', () => {
    test('Should error when accountID is null', () => {
      expect(accountIDValidation(null)).toBe(
        'AccountID is required and must be greater than 0'
      );
    });
    test('Should error when accountID is 0', () => {
      expect(accountIDValidation(0)).toBe(
        'AccountID is required and must be greater than 0'
      );
    });
    test('Should error when accountID is not an integer', () => {
      expect(accountIDValidation('9')).toBe(
        'AccountID is required to be an integer'
      );
    });
  });
});
