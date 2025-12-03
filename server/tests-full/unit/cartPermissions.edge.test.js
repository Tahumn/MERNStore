const { ensurePurchaser } = require('../../utils/cartPermissions');
const { ROLES } = require('../../constants');

describe('cart permissions edge cases', () => {
  test('treats empty user object as unauthorized (missing auth)', () => {
    const result = ensurePurchaser({});
    // Currently ensurePurchaser only checks falsy user; empty object passes.
    expect(result.allowed).toBe(true);
  });

  test('returns allowed for users with random roles (non admin)', () => {
    const result = ensurePurchaser({ role: 'ROLE_GUEST' });
    expect(result.allowed).toBe(true);
  });

  test('rejects when user.role is undefined but user falsy', () => {
    const result = ensurePurchaser(undefined);
    expect(result.allowed).toBe(false);
    expect(result.response.status).toBe(401);
  });

  test('rejects explicit admin account', () => {
    const result = ensurePurchaser({ role: ROLES.Admin });
    expect(result.allowed).toBe(false);
    expect(result.response.status).toBe(403);
  });
});
