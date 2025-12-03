const express = require('express');
const request = require('supertest');
const { ROLES } = require('../../constants');
const role = require('../../middleware/role');

let currentUser = null;

const injectUser = (req, res, next) => {
  req.user = currentUser;
  return next();
};

const app = express();
app.get(
  '/admin-only',
  injectUser,
  role.check(ROLES.Admin),
  (req, res) => {
    res.status(200).json({ success: true });
  }
);

beforeEach(() => {
  currentUser = null;
});

test('rejects when user missing', async () => {
  const res = await request(app).get('/admin-only');
  expect(res.status).toBe(401);
  expect(res.text).toMatch(/Unauthorized/i);
});

test('rejects when role is not admin', async () => {
  currentUser = { role: ROLES.Member };
  const res = await request(app).get('/admin-only');
  expect(res.status).toBe(403);
  expect(res.text).toMatch(/not allowed/i);
});

test('allows admin user', async () => {
  currentUser = { role: ROLES.Admin };
  const res = await request(app).get('/admin-only');
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
});
