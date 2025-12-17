jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn(value => `ObjectId(${value})`)
  }
}));

const mongoose = require('mongoose');
const {
  getStoreProductsQuery,
  getStoreProductsWishListQuery
} = require('../../utils/queries');

describe('query pipeline snapshots', () => {
  test('UT-QUERY-004 matches snapshot for standard filters', () => {
    const pipeline = getStoreProductsQuery(50, 200, 4.5);
    expect(pipeline).toMatchSnapshot();
  });

  test('UT-QUERY-005 rating 0 and min > max do not crash', () => {
    const pipeline = getStoreProductsQuery(200, 50, 0);
    const matchStage = pipeline.find(
      stage => stage.$match && stage.$match.isActive
    );
    expect(matchStage.$match.price.$gte).toBe(200);
    expect(matchStage.$match.price.$lte).toBe(50);
    expect(matchStage.$match.averageRating).toBeUndefined();
  });

  test('UT-QUERY-006 wishlist pipeline snapshot', () => {
    const pipeline = getStoreProductsWishListQuery('abc123');
    expect(pipeline).toMatchSnapshot();
  });

  test('UT-QUERY-007 throws when ObjectId fails (invalid input)', () => {
    const spy = jest
      .spyOn(mongoose.Types, 'ObjectId')
      .mockImplementation(() => {
        throw new Error('invalid object id');
      });

    expect(() => getStoreProductsWishListQuery('bad')).toThrow(
      /invalid object id/i
    );

    spy.mockRestore();
  });
});
