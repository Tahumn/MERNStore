const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('role middleware', () => {
  test('returns 401 when user missing', () => {
    const res = mockRes();
    const next = jest.fn();

    role.check(ROLES.Admin)({ user: null }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 403 when role mismatch', () => {
    const res = mockRes();
    const next = jest.fn();
    const req = { user: { role: ROLES.Member } };

    role.check(ROLES.Admin)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(
      'You are not allowed to make this request.'
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('passes through when role is allowed', () => {
    const res = mockRes();
    const next = jest.fn();
    const req = { user: { role: ROLES.Admin } };

    role.check(ROLES.Admin)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
