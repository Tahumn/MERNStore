const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

const applyPassport = require('../config/passport');
const routes = require('../routes');
const healthRouter = require('../routes/health');
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const seedData = require('../utils/seedData');

jest.setTimeout(30000);

let app;
let mongod;
let memberCredentials;
let seededProduct;

const createApp = () => {
  const appInstance = express();
  appInstance.use(express.urlencoded({ extended: true }));
  appInstance.use(express.json());

  applyPassport(appInstance);
  appInstance.use(healthRouter);
  appInstance.use(routes);

  return appInstance;
};

const seedTestData = async () => {
  const baseMember = seedData.members[0];
  const passwordHash = await bcrypt.hash(baseMember.password, 10);

  const member = await User.create({
    email: baseMember.email,
    firstName: baseMember.firstName,
    lastName: baseMember.lastName,
    password: passwordHash
  });

  const baseProduct = seedData.products[0];

  const product = await Product.create({
    sku: baseProduct.sku,
    name: baseProduct.name,
    description: baseProduct.description,
    price: baseProduct.price,
    quantity: 10,
    taxable: baseProduct.taxable,
    isActive: true,
    isFeatured: baseProduct.isFeatured
  });

  return {
    memberCredentials: {
      email: baseMember.email,
      password: baseMember.password,
      id: member._id.toString()
    },
    product
  };
};

const loginMemberAndGetToken = async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: memberCredentials.email,
      password: memberCredentials.password
    });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body.success).toBe(true);
  expect(loginRes.body.token).toMatch(/^Bearer /);

  return loginRes.body.token;
};

const createCartAndOrder = async () => {
  const token = await loginMemberAndGetToken();

  const cartRes = await request(app)
    .post('/api/cart/add')
    .set('Authorization', token)
    .send({
      products: [
        {
          product: seededProduct._id.toString(),
          price: seededProduct.price,
          quantity: 2,
          taxable: seededProduct.taxable
        }
      ]
    });

  expect(cartRes.status).toBe(200);
  expect(cartRes.body.success).toBe(true);
  expect(cartRes.body.cartId).toBeDefined();

  const cartId = cartRes.body.cartId;

  const orderRes = await request(app)
    .post('/api/order/add')
    .set('Authorization', token)
    .send({
      cartId,
      total: seededProduct.price * 2,
      paymentMethod: 'COD',
      shippingAddress: {
        address: '123 Test Street',
        city: 'Hanoi',
        country: 'VN',
        phoneNumber: '0123456789'
      }
    });

  expect(orderRes.status).toBe(200);
  expect(orderRes.body.success).toBe(true);
  expect(orderRes.body.order).toBeDefined();
  expect(orderRes.body.order._id).toBeDefined();

  const orderId = orderRes.body.order._id;

  return { token, cartId, orderId };
};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app = createApp();
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongod) {
    await mongod.stop();
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }

  const seeded = await seedTestData();
  memberCredentials = seeded.memberCredentials;
  seededProduct = seeded.product;
});

describe('End-to-end order flow with real MongoDB', () => {
  test('member can login, add to cart, checkout and persist order', async () => {
    const { cartId, orderId } = await createCartAndOrder();

    // Verify order and cart persisted in MongoDB with correct relations
    const orderDoc = await Order.findById(orderId)
      .populate('cart')
      .populate('user')
      .lean();

    expect(orderDoc).toBeTruthy();
    expect(orderDoc.user).toBeTruthy();
    expect(orderDoc.user.email).toBe(memberCredentials.email);
    expect(orderDoc.cart).toBeTruthy();
    expect(orderDoc.cart.user.toString()).toBe(memberCredentials.id);
    expect(orderDoc.cart.products).toHaveLength(1);
    expect(orderDoc.cart.products[0].product.toString()).toBe(
      seededProduct._id.toString()
    );
    expect(orderDoc.cart.products[0].quantity).toBe(2);
  });

  test('member can cancel order items and order is removed', async () => {
    const { token, cartId, orderId } = await createCartAndOrder();

    const existingOrder = await Order.findById(orderId)
      .populate('cart')
      .lean();

    expect(existingOrder).toBeTruthy();
    expect(existingOrder.cart.products).toHaveLength(1);

    const itemId = existingOrder.cart.products[0]._id.toString();

    const cancelRes = await request(app)
      .put(`/api/order/status/item/${itemId}`)
      .set('Authorization', token)
      .send({
        cartId,
        orderId,
        status: 'Cancelled'
      });

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.success).toBe(true);
    expect(cancelRes.body.orderCancelled).toBe(true);

    const orderAfter = await Order.findById(orderId);
    const cartAfter = await Cart.findById(cartId);
    const productAfter = await Product.findById(seededProduct._id);

    expect(orderAfter).toBeNull();
    expect(cartAfter).toBeNull();
    expect(productAfter.quantity).toBe(10);
  });

  test('member can list own orders via /api/order/me', async () => {
    const { token, cartId, orderId } = await createCartAndOrder();

    const listRes = await request(app)
      .get('/api/order/me')
      .set('Authorization', token);

    expect(listRes.status).toBe(200);
    expect(listRes.body.count).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(listRes.body.orders)).toBe(true);

    const found = listRes.body.orders.find(
      order => String(order._id) === String(orderId)
    );

    expect(found).toBeDefined();
    expect(String(found.cartId)).toBe(String(cartId));
    expect(found.products && found.products.length).toBeGreaterThan(0);
    expect(found.total).toBeGreaterThan(0);
  });
});
