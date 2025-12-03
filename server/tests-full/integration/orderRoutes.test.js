const express = require('express');

jest.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn().mockReturnValue(true)
    }
  }
}));
const request = require('supertest');
const { ROLES } = require('../../constants');

jest.mock('../../middleware/auth', () => {
  const middleware = (req, res, next) => {
    if (!middleware.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    req.user = middleware.user;
    return next();
  };
  middleware.user = null;
  middleware.setUser = user => {
    middleware.user = user;
  };
  return middleware;
});

jest.mock('../../models/order', () => {
  const Order = jest.fn().mockImplementation(data => {
    Order.lastCall = data;
    return {
      save: Order.saveMock
    };
  });
  Order.saveMock = jest.fn().mockResolvedValue({
    _id: 'order123',
    cart: 'cart123',
    created: new Date(),
    total: 250,
    payment: { method: 'COD', status: 'Pending' },
    shipping: {}
  });
  return Order;
});

jest.mock('../../models/cart', () => ({
  findById: jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue({
      products: [
        {
          product: { brand: {} },
          status: 'Processing',
          quantity: 1
        }
      ]
    })
  })
}));

jest.mock('../../services/mailgun', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));

jest.mock('../../models/product', () => ({}));
jest.mock('../../models/address', () => ({
  findOne: jest.fn()
}));

const auth = require('../../middleware/auth');
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const mailgun = require('../../services/mailgun');
const orderRoutes = require('../../routes/api/order');

const app = express();
app.use(express.json());
app.use('/api/order', orderRoutes);

beforeEach(() => {
  jest.clearAllMocks();
  auth.setUser(null);
});

test('rejects unauthenticated requests', async () => {
  const res = await request(app).post('/api/order/add').send({});

  expect(res.status).toBe(401);
  expect(res.body.error).toMatch(/Authentication required/i);
});

test('rejects admin users placing orders', async () => {
  auth.setUser({ _id: 'admin', role: ROLES.Admin });

  const res = await request(app).post('/api/order/add').send({
    cartId: 'cart123',
    total: 100,
    paymentMethod: 'COD',
    shippingAddress: {
      address: '123 st',
      city: 'HN',
      country: 'VN',
      phoneNumber: '0123'
    }
  });

  expect(res.status).toBe(403);
  expect(res.body.error).toMatch(/Store management accounts/i);
});

test('fails when cartId missing', async () => {
  auth.setUser({ _id: 'user1', role: ROLES.Member });

  const res = await request(app).post('/api/order/add').send({
    total: 100,
    paymentMethod: 'COD',
    shippingAddress: {
      address: '123 st',
      city: 'HN',
      country: 'VN',
      phoneNumber: '0123'
    }
  });

  expect(res.status).toBe(400);
  expect(res.body.error).toMatch(/Missing cart reference/i);
});

test('fails when shipping info incomplete', async () => {
  auth.setUser({ _id: 'user1', role: ROLES.Member, email: 'user@test.com' });

  const res = await request(app).post('/api/order/add').send({
    cartId: 'cart123',
    total: 100,
    paymentMethod: 'COD',
    shippingAddress: {
      city: 'HN',
      country: 'VN',
      phoneNumber: '0123'
    }
  });

  expect(res.status).toBe(400);
  expect(res.body.error).toMatch(/complete shipping information/i);
});

test('creates order successfully for member user', async () => {
  auth.setUser({
    _id: 'user1',
    role: ROLES.Member,
    email: 'user@test.com'
  });

  const payload = {
    cartId: 'cart123',
    total: 200,
    paymentMethod: 'COD',
    shippingAddress: {
      address: '123 st',
      city: 'HN',
      country: 'VN',
      phoneNumber: '0123'
    }
  };

  const res = await request(app).post('/api/order/add').send(payload);

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(Order).toHaveBeenCalled();
  expect(Order.saveMock).toHaveBeenCalled();
  expect(Cart.findById).toHaveBeenCalledWith('cart123');
  expect(mailgun.sendEmail).toHaveBeenCalled();
});
