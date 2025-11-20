const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const Review = require('../../models/review');
const Product = require('../../models/product');
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const auth = require('../../middleware/auth');
const { REVIEW_STATUS, CART_ITEM_STATUS } = require('../../constants');
const { ensureProductImage } = require('../../utils/productImage');

router.post('/add', auth, async (req, res) => {
  try {
    const user = req.user;
    const productId = req.body.product;

    if (!productId) {
      return res.status(400).json({
        error: 'Product reference is required to add a review.'
      });
    }

    const deliveredCart = await Cart.findOne({
      user: user._id,
      'products.product': productId,
      'products.status': { $in: [CART_ITEM_STATUS.Delivered, CART_ITEM_STATUS.Completed] }
    }).select('_id');

    if (!deliveredCart) {
      return res.status(403).json({
        error:
          'You can only review items that have been delivered. Please wait until your order is completed.'
      });
    }

    const hasCompletedOrder = await Order.exists({
      user: user._id,
      cart: deliveredCart._id
    });

    if (!hasCompletedOrder) {
      return res.status(403).json({
        error:
          'You can only review items that have been delivered. Please wait until your order is completed.'
      });
    }

    const review = new Review({
      ...req.body,
      user: user._id,
      status: REVIEW_STATUS.Approved
    });

    const reviewDoc = await review.save();

    res.status(200).json({
      success: true,
      message: `Your review has been published successfully!`,
      review: reviewDoc
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch all reviews api
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find()
      .sort('-created')
      .populate({
        path: 'user',
        select: 'firstName'
      })
      .populate({
        path: 'product',
        select: 'name slug imageUrl'
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Review.countDocuments();

    const reviewsWithImages = reviews.map(item => {
      const doc = typeof item.toObject === 'function' ? item.toObject() : item;
      if (doc.product) {
        doc.product = ensureProductImage(doc.product);
      }
      return doc;
    });

    res.status(200).json({
      reviews: reviewsWithImages,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const productDoc = await Product.findOne({ slug: req.params.slug });

    const hasNoBrand =
      productDoc?.brand === null || productDoc?.brand?.isActive === false;

    if (!productDoc || hasNoBrand) {
      return res.status(404).json({
        message: 'No product found.'
      });
    }

    const reviews = await Review.find({
      product: productDoc._id,
      status: REVIEW_STATUS.Approved
    })
      .populate({
        path: 'user',
        select: 'firstName'
      })
      .sort('-created');

    res.status(200).json({
      reviews
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;
    const update = req.body;
    const query = { _id: reviewId };

    await Review.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: 'review has been updated successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// approve review
router.put('/approve/:reviewId', auth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const query = { _id: reviewId };
    const update = {
      status: REVIEW_STATUS.Approved,
      isActive: true
    };

    await Review.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// reject review
router.put('/reject/:reviewId', auth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const query = { _id: reviewId };
    const update = {
      status: REVIEW_STATUS.Rejected
    };

    await Review.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const review = await Review.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `review has been deleted successfully!`,
      review
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
