const Mongoose = require('mongoose');

const isValidNumber = value => typeof value === 'number' && !Number.isNaN(value);

exports.getStoreProductsQuery = (min, max, rating) => {
  const numericRating = Number(rating);
  const numericMax = Number(max);
  const numericMin = Number(min);

  const hasMin = isValidNumber(numericMin) && numericMin >= 0;
  const hasMax = isValidNumber(numericMax) && numericMax > 0;
  const hasRating = isValidNumber(numericRating) && numericRating > 0;

  const matchQuery = {
    isActive: true
  };

  if (hasMin || hasMax) {
    matchQuery.price = {};
    if (hasMin) {
      matchQuery.price.$gte = numericMin;
    }
    if (hasMax) {
      matchQuery.price.$lte = numericMax;
    }
  }

  if (hasRating) {
    matchQuery.averageRating = { $gte: numericRating };
  }

  const basicQuery = [
    {
      $lookup: {
        from: 'brands',
        localField: 'brand',
        foreignField: '_id',
        as: 'brands'
      }
    },
    {
      $unwind: {
        path: '$brands',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        'brand.name': '$brands.name',
        'brand._id': '$brands._id',
        'brand.slug': '$brands.slug',
        'brand.isActive': '$brands.isActive'
      }
    },
    {
      $match: {
        'brand.isActive': true
      }
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product',
        as: 'reviews'
      }
    },
    {
      $addFields: {
        totalRatings: { $sum: '$reviews.rating' },
        totalReviews: { $size: '$reviews' }
      }
    },
    {
      $addFields: {
        averageRating: {
          $cond: [
            { $eq: ['$totalReviews', 0] },
            0,
            { $divide: ['$totalRatings', '$totalReviews'] }
          ]
        }
      }
    },
    {
      $match: matchQuery
    },
    {
      $project: {
        brands: 0,
        reviews: 0
      }
    }
  ];

  return basicQuery;
};

exports.getStoreProductsWishListQuery = userId => {
  const wishListQuery = [
    {
      $lookup: {
        from: 'wishlists',
        let: { product: '$_id' },
        pipeline: [
          {
            $match: {
              $and: [
                { $expr: { $eq: ['$$product', '$product'] } },
                { user: new Mongoose.Types.ObjectId(userId) }
              ]
            }
          }
        ],
        as: 'isLiked'
      }
    },
    {
      $addFields: {
        isLiked: { $arrayElemAt: ['$isLiked.isLiked', 0] }
      }
    }
  ];

  return wishListQuery;
};
