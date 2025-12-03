const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

const dummyRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('role middleware edge cases', () => {
  test('handles undefined role on user object', () => {
    const res = dummyRes();
    const next = jest.fn();
    const req = { user: {} };

    role.check(ROLES.Admin)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(
      'You are not allowed to make this request.'
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('allows custom role when included in allowed list', () => {
    const res = dummyRes();
    const next = jest.fn();
    const req = { user: { role: 'ROLE_CUSTOM' } };

    role.check('ROLE_CUSTOM')(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
