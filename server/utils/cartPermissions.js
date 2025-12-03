const { ROLES } = require('../constants');

/**
 * Guard to make sure only shopper accounts can touch cart endpoints.
 * Returns `{ allowed: boolean, response?: { status, body } }`.
 */
const ensurePurchaser = user => {
  if (!user) {
    return {
      allowed: false,
      response: {
        status: 401,
        body: { error: 'Authentication required to manage the cart.' }
      }
    };
  }

  if (user.role === ROLES.Admin) {
    return {
      allowed: false,
      response: {
        status: 403,
        body: {
          error: 'Store management accounts cannot create or update carts.'
        }
      }
    };
  }

  return { allowed: true };
};

module.exports = { ensurePurchaser };
