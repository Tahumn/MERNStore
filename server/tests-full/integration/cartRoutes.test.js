const express = require('express');
const request = require('supertest');
const { ROLES } = require('../../constants');

jest.mock('../../middleware/auth', () => {
  const middleware = (req, res, next) => {
    req.user = middleware.user;
    return next();
  };
  middleware.user = null;
  middleware.setUser = user => {
    middleware.user = user;
  };
  return middleware;
});

jest.mock('../../models/cart', () => {
  const Cart = jest.fn().mockImplementation(data => {
    Cart.lastCall = data;
    return {
      save: Cart.saveMock
    };
  });
  Cart.saveMock = jest.fn().mockResolvedValue({ id: 'cart123' });
  Cart.deleteOne = jest.fn().mockResolvedValue({});
  Cart.updateOne = jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue({})
  }));
  return Cart;
});

jest.mock('../../models/product', () => ({
  bulkWrite: jest.fn().mockResolvedValue({})
}));

jest.mock('../../utils/store', () => {
  const actual = jest.requireActual('../../utils/store');
  return {
    ...actual,
    caculateItemsSalesTax: jest.fn(items => items)
  };
});

const auth = require('../../middleware/auth');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const store = require('../../utils/store');
const cartRoutes = require('../../routes/api/cart');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/cart', cartRoutes);
  return app;
};

describe('Cart routes integration', () => {
  beforeEach(() => {
    auth.setUser(null);
    jest.clearAllMocks();
    Cart.saveMock.mockResolvedValue({ id: 'cart123' });
  });

  test('rejects unauthenticated requests', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/cart/add')
      .send({ products: [] });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Authentication required/i);
  });

  test('rejects admin users creating carts', async () => {
    const app = createApp();
    auth.setUser({ _id: 'admin1', role: ROLES.Admin });

    const res = await request(app)
      .post('/api/cart/add')
      .send({ products: [] });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/Store management accounts/i);
  });

  test('creates cart for member user', async () => {
    const app = createApp();
    auth.setUser({ _id: 'member1', role: ROLES.Member });

    const payload = {
      products: [{ product: 'p1', price: 100, quantity: 1, taxable: true }]
    };
    store.caculateItemsSalesTax.mockReturnValue([{ product: 'p1', quantity: 1 }]);

    const res = await request(app).post('/api/cart/add').send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cartId).toBe('cart123');
    expect(store.caculateItemsSalesTax).toHaveBeenCalledWith(payload.products);
    expect(Cart).toHaveBeenCalledWith({
      user: 'member1',
      products: [{ product: 'p1', quantity: 1 }]
    });
    expect(Product.bulkWrite).toHaveBeenCalledTimes(1);
    expect(Cart.saveMock).toHaveBeenCalled();
  });

  test('allows member to add product to existing cart', async () => {
    const app = createApp();
    auth.setUser({ _id: 'member1', role: ROLES.Member });

    const payload = { product: { product: 'p2', quantity: 2 } };
    const res = await request(app)
      .post('/api/cart/add/cart123')
      .send(payload);

    expect(res.status).toBe(200);
    expect(Cart.updateOne).toHaveBeenCalledWith(
      { _id: 'cart123' },
      { $push: { products: payload.product } }
    );
  });

  test('allows member to delete entire cart', async () => {
    const app = createApp();
    auth.setUser({ _id: 'member1', role: ROLES.Member });

    const res = await request(app).delete('/api/cart/delete/cart789');

    expect(res.status).toBe(200);
    expect(Cart.deleteOne).toHaveBeenCalledWith({ _id: 'cart789' });
  });

  test('allows member to delete specific product from cart', async () => {
    const app = createApp();
    auth.setUser({ _id: 'member1', role: ROLES.Member });

    const res = await request(app).delete(
      '/api/cart/delete/cart789/product123'
    );

    expect(res.status).toBe(200);
    expect(Cart.updateOne).toHaveBeenCalledWith(
      { _id: 'cart789' },
      { $pull: { products: { product: 'product123' } } }
    );
  });
});
