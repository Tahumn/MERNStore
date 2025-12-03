const express = require('express');
const request = require('supertest');
const { ROLES, CART_ITEM_STATUS } = require('../../constants');

jest.mock('mongoose', () => {
  const mockObjectId = value => value;
  mockObjectId.isValid = jest.fn().mockReturnValue(true);
  return {
    Types: {
      ObjectId: mockObjectId
    }
  };
});

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
  const Order = function () {};
  Order.find = jest.fn();
  Order.findOne = jest.fn();
  Order.countDocuments = jest.fn();
  Order.deleteOne = jest.fn();
  return Order;
});

jest.mock('../../models/cart', () => ({
  findOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn()
}));

jest.mock('../../models/product', () => ({
  updateOne: jest.fn()
}));

jest.mock('../../services/mailgun', () => ({
  sendEmail: jest.fn()
}));

jest.mock('../../models/address', () => ({
  findOne: jest.fn()
}));

jest.mock('../../utils/store', () => ({
  formatOrders: jest.fn(),
  caculateTaxAmount: jest.fn()
}));

const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const store = require('../../utils/store');
const orderRoutes = require('../../routes/api/order');

const app = express();
app.use(express.json());
app.use('/api/order', orderRoutes);

const createListQuery = data => {
  return {
    sort: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(data)
  };
};

const mockPopulateQuery = data => ({
  populate: jest.fn().mockResolvedValue(data)
});

beforeEach(() => {
  jest.clearAllMocks();
  auth.setUser({
    _id: 'user-basic',
    role: ROLES.Member,
    email: 'member@example.com'
  });
  mongoose.Types.ObjectId.isValid.mockReturnValue(true);
});

describe('Order routes extended integration', () => {
  test('GET /api/order/search returns [] when search id invalid', async () => {
    mongoose.Types.ObjectId.isValid.mockReturnValue(false);

    const res = await request(app).get('/api/order/search?search=bad-id');

    expect(res.status).toBe(200);
    expect(res.body.orders).toEqual([]);
    expect(Order.find).not.toHaveBeenCalled();
  });

  test('GET /api/order/search returns sanitized orders for admin', async () => {
    auth.setUser({
      _id: 'admin-1',
      role: ROLES.Admin,
      email: 'admin@example.com'
    });
    const orderDoc = {
      _id: 'order-1',
      total: 123.456,
      created: new Date('2024-05-01'),
      cart: { products: [] },
      payment: { status: 'Pending' },
      shipping: { city: 'Hanoi' }
    };
    store.caculateTaxAmount.mockImplementation(order => ({
      ...order,
      totalTax: 5
    }));
    Order.find.mockReturnValueOnce(mockPopulateQuery([orderDoc]));

    const res = await request(app).get('/api/order/search?search=665544332211');

    expect(res.status).toBe(200);
    expect(store.caculateTaxAmount).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 'order-1' })
    );
    expect(res.body.orders[0]._id).toBe('order-1');
    expect(res.body.orders[0].total).toBeCloseTo(123.46, 2);
  });

  test('GET /api/order/me paginates and formats results', async () => {
    const listQuery = createListQuery([{ _id: 'order-2' }]);
    Order.find.mockReturnValueOnce(listQuery);
    Order.countDocuments.mockResolvedValueOnce(3);
    store.formatOrders.mockReturnValue([{ _id: 'order-2', total: 90 }]);

    const res = await request(app).get('/api/order/me?page=2&limit=1');

    expect(res.status).toBe(200);
    expect(Order.find).toHaveBeenCalledWith({ user: 'user-basic' });
    expect(res.body.totalPages).toBe(3);
    expect(res.body.currentPage).toBe(2);
    expect(res.body.orders[0]._id).toBe('order-2');
  });

  test('GET /api/order/:orderId returns normalized response for member', async () => {
    const orderDoc = {
      _id: 'order-3',
      total: 55,
      created: new Date(),
      cart: { _id: 'cart-8', products: [{ name: 'Item' }] },
      payment: { status: 'Pending' },
      shipping: { city: 'HCM' }
    };
    store.caculateTaxAmount.mockImplementation(order => ({
      ...order,
      totalTax: 7
    }));
    Order.findOne
      .mockReturnValueOnce(mockPopulateQuery(orderDoc))
      .mockResolvedValueOnce(orderDoc);

    const res = await request(app).get('/api/order/order-3');

    expect(res.status).toBe(200);
    expect(res.body.order.cartId).toBe('cart-8');
    expect(store.caculateTaxAmount).toHaveBeenCalled();
  });

  test('PUT /api/order/complete/:orderId marks delivered items as completed', async () => {
    auth.setUser({
      _id: 'member-99',
      role: ROLES.Member,
      email: 'member99@example.com'
    });

    Order.findOne.mockResolvedValueOnce({
      _id: 'order-9',
      cart: { _id: 'cart-9' }
    });
    const cartDoc = {
      products: [
        { status: CART_ITEM_STATUS.Delivered },
        { status: CART_ITEM_STATUS.Cancelled }
      ],
      markModified: jest.fn(),
      save: jest.fn().mockResolvedValue(true)
    };
    Cart.findOne.mockResolvedValueOnce(cartDoc);

    const res = await request(app).put('/api/order/complete/order-9');

    expect(res.status).toBe(200);
    expect(cartDoc.markModified).toHaveBeenCalledWith('products');
    expect(cartDoc.save).toHaveBeenCalled();
    expect(res.body.message).toMatch(/marked as completed/i);
  });

  test('PUT /api/order/status/item/:itemId cancels entire order when all items cancelled', async () => {
    auth.setUser({
      _id: 'admin-5',
      role: ROLES.Admin,
      email: 'admin5@example.com'
    });

    Cart.findOne
      .mockResolvedValueOnce({
        products: [
          {
            _id: 'item-1',
            product: 'prod-1',
            quantity: 2,
            status: CART_ITEM_STATUS.Pending
          }
        ]
      })
      .mockResolvedValueOnce({
        products: [{ status: CART_ITEM_STATUS.Cancelled }]
      });

    Cart.updateOne.mockResolvedValue({});
    Product.updateOne.mockResolvedValue({});
    Order.deleteOne.mockResolvedValue({});
    Cart.deleteOne.mockResolvedValue({});

    const res = await request(app)
      .put('/api/order/status/item/item-1')
      .send({
        cartId: 'cart-final',
        orderId: 'order-final',
        status: CART_ITEM_STATUS.Cancelled
      });

    expect(res.status).toBe(200);
    expect(Order.deleteOne).toHaveBeenCalledWith({ _id: 'order-final' });
    expect(Cart.deleteOne).toHaveBeenCalledWith({ _id: 'cart-final' });
    expect(res.body.orderCancelled).toBe(true);
  });
});
