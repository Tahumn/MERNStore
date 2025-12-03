const { ensurePurchaser } = require('../../utils/cartPermissions');
const { ROLES } = require('../../constants');

describe('ensurePurchaser', () => {
  test('rejects when user is missing', () => {
    const gate = ensurePurchaser(null);

    expect(gate.allowed).toBe(false);
    expect(gate.response.status).toBe(401);
    expect(gate.response.body.error).toMatch(/Authentication required/);
  });

  test('rejects admin accounts', () => {
    const gate = ensurePurchaser({ role: ROLES.Admin });

    expect(gate.allowed).toBe(false);
    expect(gate.response.status).toBe(403);
    expect(gate.response.body.error).toMatch(/Store management accounts/);
  });

  test('allows member shopper', () => {
    const gate = ensurePurchaser({ role: ROLES.Member });

    expect(gate).toEqual({ allowed: true });
  });
});
