const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const Wishlist = require('../../models/wishlist');
const auth = require('../../middleware/auth');
const { ensureProductImage } = require('../../utils/productImage');
const { ROLES } = require('../../constants');

const ensureMember = user => {
  if (!user) {
    return {
      allowed: false,
      response: {
        status: 401,
        body: { error: 'Authentication required to manage the wishlist.' }
      }
    };
  }

  if (user.role === ROLES.Admin) {
    return {
      allowed: false,
      response: {
        status: 403,
        body: { error: 'Store management accounts do not have a wishlist.' }
      }
    };
  }

  return { allowed: true };
};

router.post('/', auth, async (req, res) => {
  try {
    const gate = ensureMember(req.user);
    if (!gate.allowed) {
      return res.status(gate.response.status).json(gate.response.body);
    }

    const { product, isLiked } = req.body;
    const user = req.user;
    const update = {
      product,
      isLiked,
      updated: Date.now()
    };
    const query = { product: update.product, user: user._id };

    const updatedWishlist = await Wishlist.findOneAndUpdate(query, update, {
      new: true
    });

    if (updatedWishlist !== null) {
      res.status(200).json({
        success: true,
        message: 'Your Wishlist has been updated successfully!',
        wishlist: updatedWishlist
      });
    } else {
      const wishlist = new Wishlist({
        product,
        isLiked,
        user: user._id
      });

      const wishlistDoc = await wishlist.save();

      res.status(200).json({
        success: true,
        message: `Added to your Wishlist successfully!`,
        wishlist: wishlistDoc
      });
    }
  } catch (e) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch wishlist api
router.get('/', auth, async (req, res) => {
  try {
    const gate = ensureMember(req.user);
    if (!gate.allowed) {
      return res.status(gate.response.status).json(gate.response.body);
    }

    const user = req.user._id;

    const wishlist = await Wishlist.find({ user, isLiked: true })
      .populate({
        path: 'product',
        select: 'name slug price imageUrl'
      })
      .sort('-updated');

    const wishlistWithImages = wishlist.map(item => {
      const doc = typeof item.toObject === 'function' ? item.toObject() : item;
      if (doc.product) {
        doc.product = ensureProductImage(doc.product);
      }
      return doc;
    });

    res.status(200).json({
      wishlist: wishlistWithImages
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
