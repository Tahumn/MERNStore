const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose');

// Bring in Models & Utils
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const Address = require('../../models/address');
const auth = require('../../middleware/auth');
const mailgun = require('../../services/mailgun');
const store = require('../../utils/store');
const { ROLES, CART_ITEM_STATUS } = require('../../constants');

router.post('/add', auth, async (req, res) => {
  try {
    if (req.user?.role === ROLES.Admin) {
      return res.status(403).json({
        error: 'Store management accounts cannot place customer orders.'
      });
    }

    const cart = req.body.cartId;
    const total = req.body.total;
    const paymentMethod = req.body.paymentMethod;
    const selectedAddressId = req.body.selectedAddressId;
    const useNewAddress = req.body.useNewAddress;
    const shippingAddress = req.body.shippingAddress || {};
    const note = req.body.note || shippingAddress.note;
    const userId = req.user._id;

    if (!cart) {
      return res.status(400).json({
        error: 'Missing cart reference for this order.'
      });
    }

    const defaultFullName = `${req.user.firstName ?? ''} ${
      req.user.lastName ?? ''
    }`.trim();

    let finalShipping = {
      fullName: shippingAddress.fullName || defaultFullName || req.user.email,
      phoneNumber: shippingAddress.phoneNumber || req.user.phoneNumber,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: shippingAddress.country,
      zipCode: shippingAddress.zipCode,
      note: note || '',
      addressId: null,
      isAlternate: Boolean(useNewAddress)
    };

    if (!useNewAddress && selectedAddressId) {
      const savedAddress = await Address.findOne({
        _id: selectedAddressId,
        user: userId
      });

      if (!savedAddress) {
        return res.status(404).json({
          error: 'Selected address could not be found.'
        });
      }

      finalShipping = {
        fullName:
          savedAddress.fullName || finalShipping.fullName || req.user.email,
        phoneNumber:
          savedAddress.phoneNumber ||
          finalShipping.phoneNumber ||
          req.user.phoneNumber,
        address: savedAddress.address,
        city: savedAddress.city,
        state: savedAddress.state,
        country: savedAddress.country,
        zipCode: savedAddress.zipCode,
        note: finalShipping.note,
        addressId: savedAddress._id,
        isAlternate: false
      };
    }

    if (!paymentMethod) {
      return res.status(400).json({
        error: 'Please select a payment method to continue.'
      });
    }

    const requiredShippingFields = ['address', 'city', 'country', 'phoneNumber'];
    const hasMissingShipping = requiredShippingFields.some(field => {
      const value = finalShipping[field];
      return !value || `${value}`.trim().length < 1;
    });

    if (hasMissingShipping) {
      return res.status(400).json({
        error:
          'Please provide complete shipping information including phone number and address.'
      });
    }

    const order = new Order({
      cart,
      user: userId,
      total,
      payment: {
        method: paymentMethod,
        status: 'Pending'
      },
      shipping: finalShipping
    });

    const orderDoc = await order.save();

    const cartDoc = await Cart.findById(orderDoc.cart).populate({
      path: 'products.product',
      populate: {
        path: 'brand'
      }
    });

    if (!cartDoc) {
      return res.status(404).json({
        error: 'Your cart could not be found. Please try again.'
      });
    }

    const newOrder = {
      _id: orderDoc._id,
      created: orderDoc.created,
      user: {
        _id: req.user._id,
        email: req.user.email,
        profile: {
          firstName: req.user.firstName,
          lastName: req.user.lastName
        }
      },
      total: orderDoc.total,
      payment: orderDoc.payment,
      shipping: orderDoc.shipping,
      products: cartDoc.products
    };

    await mailgun.sendEmail(
      req.user.email,
      'order-confirmation',
      req.get('origin') || `${req.protocol}://${req.get('host')}`,
      newOrder
    );

    res.status(200).json({
      success: true,
      message: `Your order has been placed successfully!`,
      order: { _id: orderDoc._id }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// search orders api
router.get('/search', auth, async (req, res) => {
  try {
    const { search } = req.query;

    if (!Mongoose.Types.ObjectId.isValid(search)) {
      return res.status(200).json({
        orders: []
      });
    }

    let ordersDoc = null;

    if (req.user.role === ROLES.Admin) {
      ordersDoc = await Order.find({
        _id: Mongoose.Types.ObjectId(search)
      }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    } else {
      const user = req.user._id;
      ordersDoc = await Order.find({
        _id: Mongoose.Types.ObjectId(search),
        user
      }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    }

    ordersDoc = ordersDoc.filter(order => order.cart);

    if (ordersDoc.length > 0) {
      const newOrders = ordersDoc.map(o => {
        return {
          _id: o._id,
          total: parseFloat(Number(o.total.toFixed(2))),
          created: o.created,
          products: o.cart?.products,
          payment: o.payment,
          shipping: o.shipping
        };
      });

      let orders = newOrders.map(o => store.caculateTaxAmount(o));
      orders.sort((a, b) => b.created - a.created);
      res.status(200).json({
        orders
      });
    } else {
      res.status(200).json({
        orders: []
      });
    }
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch orders api
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const ordersDoc = await Order.find()
      .sort('-created')
      .populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Order.countDocuments();
    const orders = store.formatOrders(ordersDoc);

    res.status(200).json({
      orders,
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

// fetch my orders api
router.get('/me', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = req.user._id;
    const query = { user };

    const ordersDoc = await Order.find(query)
      .sort('-created')
      .populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Order.countDocuments(query);
    const orders = store.formatOrders(ordersDoc);

    res.status(200).json({
      orders,
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

// fetch order api
router.get('/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    let orderDoc = null;

    if (req.user.role === ROLES.Admin) {
      orderDoc = await Order.findOne({ _id: orderId }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    } else {
      const user = req.user._id;
      orderDoc = await Order.findOne({ _id: orderId, user }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    }

    if (!orderDoc || !orderDoc.cart) {
      return res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    let order = {
      _id: orderDoc._id,
      total: orderDoc.total,
      created: orderDoc.created,
      totalTax: 0,
      products: orderDoc?.cart?.products,
      cartId: orderDoc.cart._id,
      payment: orderDoc.payment,
      shipping: orderDoc.shipping
    };

    order = store.caculateTaxAmount(order);

    res.status(200).json({
      order
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete('/cancel/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId });
    const foundCart = await Cart.findOne({ _id: order.cart });

    increaseQuantity(foundCart.products);

    await Order.deleteOne({ _id: orderId });
    await Cart.deleteOne({ _id: order.cart });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// mark order as completed (customer confirmation)
router.put('/complete/:orderId', auth, async (req, res) => {
  try {
    if (req.user.role === ROLES.Admin) {
      return res.status(403).json({
        error: 'Store management accounts cannot complete customer orders.'
      });
    }

    const orderId = req.params.orderId;
    const userId = req.user._id;

    const orderDoc = await Order.findOne({ _id: orderId, user: userId });

    if (!orderDoc) {
      return res.status(404).json({
        error: 'Order could not be found for this account.'
      });
    }

    const cartId = orderDoc.cart?._id || orderDoc.cart;
    const cartDoc = await Cart.findOne({ _id: cartId });

    if (!cartDoc) {
      return res.status(404).json({
        error: 'Cart items for this order could not be found.'
      });
    }

    const hasPendingItems = cartDoc.products.some(
      item =>
        ![
          CART_ITEM_STATUS.Delivered,
          CART_ITEM_STATUS.Completed,
          CART_ITEM_STATUS.Cancelled
        ].includes(item.status)
    );

    if (hasPendingItems) {
      return res.status(400).json({
        error:
          'Order is not ready to complete. Please wait until all items are delivered.'
      });
    }

    const allCompleted = cartDoc.products.every(item =>
      [CART_ITEM_STATUS.Completed, CART_ITEM_STATUS.Cancelled].includes(
        item.status
      )
    );

    if (allCompleted) {
      return res.status(200).json({
        success: true,
        message: 'Order is already marked as completed.'
      });
    }

    cartDoc.products = cartDoc.products.map(item => {
      if (item.status === CART_ITEM_STATUS.Delivered) {
        item.status = CART_ITEM_STATUS.Completed;
      }
      return item;
    });

    cartDoc.markModified('products');
    await cartDoc.save();

    res.status(200).json({
      success: true,
      message: 'Order has been marked as completed.'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/status/item/:itemId', auth, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const orderId = req.body.orderId;
    const cartId = req.body.cartId;
    const status = req.body.status || CART_ITEM_STATUS.Cancelled;

    const foundCart = await Cart.findOne({ 'products._id': itemId });
    const foundCartProduct = foundCart.products.find(p => p._id == itemId);

    await Cart.updateOne(
      { 'products._id': itemId },
      {
        'products.$.status': status
      }
    );

    if (status === CART_ITEM_STATUS.Cancelled) {
      await Product.updateOne(
        { _id: foundCartProduct.product },
        { $inc: { quantity: foundCartProduct.quantity } }
      );

      const cart = await Cart.findOne({ _id: cartId });
      const items = cart.products.filter(
        item => item.status === CART_ITEM_STATUS.Cancelled
      );

      // All items are cancelled => Cancel order
      if (cart.products.length === items.length) {
        await Order.deleteOne({ _id: orderId });
        await Cart.deleteOne({ _id: cartId });

        return res.status(200).json({
          success: true,
          orderCancelled: true,
          message: `${
            req.user.role === ROLES.Admin ? 'Order' : 'Your order'
          } has been cancelled successfully`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item has been cancelled successfully!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item status has been updated successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

const increaseQuantity = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: item.quantity } }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};

module.exports = router;
