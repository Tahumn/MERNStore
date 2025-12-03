global.window = { location: { host: 'localhost' } };

const { ROLES, EMAIL_PROVIDER } = require('../constants');
const { isProviderAllowed, isDisabledMerchantAccount } = require('./app');

describe('app utility helpers', () => {
  test('validates allowed OAuth providers', () => {
    expect(isProviderAllowed(EMAIL_PROVIDER.Google)).toBe(true);
    expect(isProviderAllowed(EMAIL_PROVIDER.Facebook)).toBe(true);
    expect(isProviderAllowed('github')).toBe(false);
  });

  test('flags disabled merchant accounts while leaving others untouched', () => {
    const disabledMerchant = {
      role: ROLES.Merchant,
      merchant: { isActive: false }
    };

    const activeMerchant = {
      role: ROLES.Merchant,
      merchant: { isActive: true }
    };

    const adminUser = {
      role: ROLES.Admin,
      merchant: { isActive: false }
    };

    expect(isDisabledMerchantAccount(disabledMerchant)).toBe(true);
    expect(isDisabledMerchantAccount(activeMerchant)).toBe(false);
    expect(isDisabledMerchantAccount(adminUser)).toBe(false);
  });
});
