const express = require('express');
const request = require('supertest');

jest.mock('../../models/product', () => ({
  find: jest.fn(),
  aggregate: jest.fn()
}));
jest.mock('../../models/brand', () => ({}));
jest.mock('../../models/category', () => ({}));
jest.mock('../../utils/queries', () => ({
  getStoreProductsQuery: jest.fn(),
  getStoreProductsWishListQuery: jest.fn()
}));

const Product = require('../../models/product');
const productRoutes = require('../../routes/api/product');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/product', productRoutes);
  return app;
};

const mockFindResult = value => {
  const lean = jest.fn().mockResolvedValue(value);
  Product.find.mockReturnValue({ lean });
  return lean;
};

const mockFindError = error => {
  const lean = jest.fn().mockRejectedValue(error);
  Product.find.mockReturnValue({ lean });
  return lean;
};

describe('GET /api/product/list/search/:name', () => {
  test('returns products when matches are found', async () => {
    const app = createApp();
    mockFindResult([
      { name: 'Camera 01', slug: 'camera-01', imageUrl: '', price: 100 }
    ]);

    const res = await request(app).get('/api/product/list/search/camera');

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(1);
    expect(Product.find).toHaveBeenCalledWith(
      {
        name: { $regex: expect.any(RegExp), $options: 'is' },
        isActive: true
      },
      { name: 1, slug: 1, imageUrl: 1, price: 1, _id: 0 }
    );
  });

  test('returns 404 when nothing matches', async () => {
    const app = createApp();
    mockFindResult([]);

    const res = await request(app).get('/api/product/list/search/unknown');

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/No product found/);
  });

  test('returns 400 when find throws error', async () => {
    const app = createApp();
    const error = new Error('DB error');
    mockFindError(error);

    const res = await request(app).get('/api/product/list/search/fail');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/could not be processed/i);
  });
});
