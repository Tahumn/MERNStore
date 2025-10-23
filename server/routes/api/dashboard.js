const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

const { ROLES, CART_ITEM_STATUS } = require('../../constants');

const Order = require('../../models/order');
const Product = require('../../models/product');
const User = require('../../models/user');
const Cart = require('../../models/cart');
const Mongoose = require('mongoose');
const { ensureProductsHaveImage } = require('../../utils/productImage');

const getOrderStatus = products => {
  if (!products || products.length < 1) {
    return CART_ITEM_STATUS.Not_processed;
  }

  const statuses = products.map(item => item.status);

  if (statuses.every(status => status === CART_ITEM_STATUS.Delivered)) {
    return CART_ITEM_STATUS.Delivered;
  }

  if (statuses.some(status => status === CART_ITEM_STATUS.Shipped)) {
    return CART_ITEM_STATUS.Shipped;
  }

  if (statuses.some(status => status === CART_ITEM_STATUS.Processing)) {
    return CART_ITEM_STATUS.Processing;
  }

  if (statuses.some(status => status === CART_ITEM_STATUS.Not_processed)) {
    return CART_ITEM_STATUS.Not_processed;
  }

  if (statuses.every(status => status === CART_ITEM_STATUS.Cancelled)) {
    return CART_ITEM_STATUS.Cancelled;
  }

  return CART_ITEM_STATUS.Processing;
};

router.get('/summary', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const [ordersCount, revenueAgg, customersCount, productsCount, cartIds, recentOrderDocs] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
        User.countDocuments({ role: ROLES.Member }),
        Product.countDocuments({ isActive: true }),
        Order.distinct('cart'),
        Order.find()
          .sort({ created: -1 })
          .limit(5)
          .populate('user', 'firstName lastName email')
          .populate({
            path: 'cart',
            populate: {
              path: 'products.product',
              select: 'name slug imageUrl'
            }
          })
      ]);

    const totalRevenue =
      revenueAgg && revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const cartObjectIds = cartIds
      .filter(Boolean)
      .map(id =>
        typeof id === 'string' ? new Mongoose.Types.ObjectId(id) : id
      );

    let pendingOrders = 0;
    let topProducts = [];

    if (cartObjectIds.length > 0) {
      pendingOrders = await Cart.countDocuments({
        _id: { $in: cartObjectIds },
        'products.status': {
          $in: [
            CART_ITEM_STATUS.Processing,
            CART_ITEM_STATUS.Not_processed,
            CART_ITEM_STATUS.Shipped
          ]
        }
      });

      topProducts = await Cart.aggregate([
        { $match: { _id: { $in: cartObjectIds } } },
        { $unwind: '$products' },
        {
          $match: {
            'products.status': { $ne: CART_ITEM_STATUS.Cancelled }
          }
        },
        {
          $group: {
            _id: '$products.product',
            totalSold: { $sum: '$products.quantity' }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            _id: '$product._id',
            name: '$product.name',
            imageUrl: '$product.imageUrl',
            price: '$product.price',
            slug: '$product.slug',
            totalSold: 1
          }
        }
      ]);
    }

    const recentOrders = recentOrderDocs.map(order => {
      const customerName = order.user
        ? [order.user.firstName, order.user.lastName].filter(Boolean).join(' ') ||
          order.user.email
        : 'Guest';

      const items = order.cart?.products?.length || 0;

      return {
        _id: order._id,
        total: Number(order.total.toFixed(2)),
        created: order.created,
        customer: customerName,
        status: getOrderStatus(order.cart?.products),
        items
      };
    });

    const formattedTopProducts = ensureProductsHaveImage(topProducts);

    res.status(200).json({
      summary: {
        revenue: Number(totalRevenue.toFixed(2)),
        orders: ordersCount,
        pendingOrders,
        customers: customersCount,
        products: productsCount
      },
      recentOrders,
      topProducts: formattedTopProducts
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
