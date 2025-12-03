const express = require('express');
const request = require('supertest');

let mockAuthUser = { _id: 'user1' };

jest.mock('../../middleware/auth', () => {
  return (req, res, next) => {
    req.user = mockAuthUser;
    return next();
  };
});

jest.mock('../../models/product', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  aggregate: jest.fn()
}));

jest.mock('../../models/category', () => ({
  findOne: jest.fn()
}));

jest.mock('../../models/brand', () => ({
  findOne: jest.fn()
}));

jest.mock('../../utils/auth', () => jest.fn());

jest.mock('../../utils/productImage', () => ({
  ensureProductImage: jest.fn(doc => doc),
  ensureProductsHaveImage: jest.fn(list => list)
}));

jest.mock('../../utils/queries', () => ({
  getStoreProductsQuery: jest.fn(),
  getStoreProductsWishListQuery: jest.fn()
}));

const Product = require('../../models/product');
const Category = require('../../models/category');
const Brand = require('../../models/brand');
const checkAuth = require('../../utils/auth');
const {
  ensureProductImage,
  ensureProductsHaveImage
} = require('../../utils/productImage');
const {
  getStoreProductsQuery,
  getStoreProductsWishListQuery
} = require('../../utils/queries');
const productRoutes = require('../../routes/api/product');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/product', productRoutes);
  return app;
};

const mockPopulateResult = result => {
  const populate = jest.fn().mockResolvedValue(result);
  Product.findOne.mockReturnValue({ populate });
  return populate;
};

beforeEach(() => {
  jest.clearAllMocks();
  checkAuth.mockReset();
  getStoreProductsQuery.mockReset();
  getStoreProductsWishListQuery.mockReset();
  ensureProductImage.mockImplementation(doc => doc);
  ensureProductsHaveImage.mockImplementation(list => list);
  mockAuthUser = { _id: 'user1' };
});

describe('Product routes extended integration', () => {
  test('GET /api/product/item/:slug returns payload when product and brand active', async () => {
    const app = createApp();

    const productDoc = {
      name: 'Camera',
      slug: 'camera-01',
      brand: { isActive: true, name: 'BrandX' }
    };
    ensureProductImage.mockReturnValue({ ...productDoc, imageUrl: '/img.jpg' });
    mockPopulateResult(productDoc);

    const res = await request(app).get('/api/product/item/camera-01');

    expect(res.status).toBe(200);
    expect(ensureProductImage).toHaveBeenCalledWith(productDoc);
    expect(res.body.product.imageUrl).toBe('/img.jpg');
  });

  test('GET /api/product/item/:slug returns 404 when product brand inactive', async () => {
    const app = createApp();

    const productDoc = {
      name: 'Old Camera',
      slug: 'camera-old',
      brand: { isActive: false }
    };

    mockPopulateResult(productDoc);

    const res = await request(app).get('/api/product/item/camera-old');

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/No product found/i);
  });

  test('GET /api/product/list applies filters, wishlist, and pagination', async () => {
    const app = createApp();

    const baseQuery = [{ $match: { isActive: true } }];
    getStoreProductsQuery.mockReturnValue(baseQuery);
    getStoreProductsWishListQuery.mockReturnValue([{ $lookup: 'wishlist' }]);
    checkAuth.mockResolvedValue({ id: 'member-1' });
    Category.findOne.mockResolvedValue({
      products: ['prod-1', 'prod-2']
    });
    Brand.findOne.mockResolvedValue({
      _id: 'brand-1'
    });

    Product.aggregate
      .mockResolvedValueOnce([{ _id: 'prod-1' }, { _id: 'prod-2' }])
      .mockResolvedValueOnce([
        { name: 'Camera', slug: 'camera', imageUrl: '' }
      ]);
    ensureProductsHaveImage.mockReturnValue([
      { name: 'Camera', slug: 'camera', imageUrl: '/img' }
    ]);

    const res = await request(app).get(
      '/api/product/list?category=camera&brand=best-brand&min=10&max=500&page=1&limit=2'
    );

    expect(res.status).toBe(200);
    expect(Product.aggregate).toHaveBeenCalledTimes(2);
    expect(Product.aggregate.mock.calls[1][0]).toEqual(
      expect.arrayContaining([
        { $lookup: 'wishlist' },
        expect.objectContaining({ $match: expect.any(Object) }),
        expect.objectContaining({ $sort: expect.any(Object) }),
        expect.objectContaining({ $limit: expect.any(Number) })
      ])
    );
    expect(res.body.totalPages).toBeGreaterThanOrEqual(1);
    expect(res.body.count).toBe(2);
    expect(res.body.products[0].imageUrl).toBe('/img');
  });

  test('GET /api/product/featured returns featured list for guest user', async () => {
    const app = createApp();
    checkAuth.mockResolvedValue(null);
    getStoreProductsQuery.mockReturnValue([{ $match: { isActive: true } }]);

    Product.aggregate.mockResolvedValue([
      { name: 'Featured Item', imageUrl: '' }
    ]);
    ensureProductsHaveImage.mockReturnValue([
      { name: 'Featured Item', imageUrl: '/featured' }
    ]);

    const res = await request(app).get('/api/product/featured?limit=3');

    expect(res.status).toBe(200);
    expect(Product.aggregate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ $match: expect.objectContaining({ isFeatured: true }) })
      ])
    );
    expect(res.body.products[0].imageUrl).toBe('/featured');
  });

  test('GET /api/product/popular respects rating/min/max filters', async () => {
    const app = createApp();
    checkAuth.mockResolvedValue(null);
    getStoreProductsQuery.mockReturnValue([{ $match: { isActive: true } }]);

    Product.aggregate.mockResolvedValue([
      { name: 'Popular Item', imageUrl: '' }
    ]);
    ensureProductsHaveImage.mockReturnValue([
      { name: 'Popular Item', imageUrl: '/popular' }
    ]);

    const res = await request(app).get(
      '/api/product/popular?limit=1&rating=4&min=10&max=100'
    );

    expect(res.status).toBe(200);
    expect(Product.aggregate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ $sort: expect.objectContaining({ totalReviews: -1 }) }),
        expect.objectContaining({ $limit: 1 })
      ])
    );
    expect(res.body.products[0].imageUrl).toBe('/popular');
  });

  test('GET /api/product/list/select returns minimal product names under auth guard', async () => {
    const app = createApp();
    mockAuthUser = { _id: 'member1' };
    Product.find.mockResolvedValue([
      { _id: 'p1', name: 'Camera Prime' },
      { _id: 'p2', name: 'Lens Kit' }
    ]);

    const res = await request(app).get('/api/product/list/select');

    expect(res.status).toBe(200);
    expect(Product.find).toHaveBeenCalledWith({}, 'name');
    expect(res.body.products).toHaveLength(2);
  });
});
