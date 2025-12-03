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

describe('getStoreProductsQuery', () => {
  test('adds price and rating filters when provided', () => {
    const pipeline = getStoreProductsQuery(100, 500, 4);
    const matchStage = pipeline.find(
      stage => stage.$match && stage.$match.isActive
    );

    expect(matchStage.$match).toMatchObject({
      isActive: true,
      price: { $gte: 100, $lte: 500 },
      averageRating: { $gte: 4 }
    });
  });

  test('defaults to only active products when filters missing', () => {
    const pipeline = getStoreProductsQuery(undefined, undefined, undefined);
    const matchStage = pipeline.find(
      stage => stage.$match && stage.$match.isActive
    );

    expect(matchStage.$match).toMatchObject({ isActive: true });
  });
});

describe('getStoreProductsWishListQuery', () => {
  test('builds lookup pipeline that filters by user wishlist', () => {
    const pipeline = getStoreProductsWishListQuery('user-123');

    expect(pipeline).toHaveLength(2);

    const lookupStage = pipeline[0];
    const matchClause = lookupStage.$lookup.pipeline[0].$match.$and[1];

    expect(matchClause).toHaveProperty('user');
    expect(mongoose.Types.ObjectId).toHaveBeenCalledWith('user-123');
    expect(pipeline[1]).toEqual({
      $addFields: { isLiked: { $arrayElemAt: ['$isLiked.isLiked', 0] } }
    });
  });
});
