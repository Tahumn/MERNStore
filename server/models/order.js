const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Order Schema
const OrderSchema = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  total: {
    type: Number,
    default: 0
  },
  payment: {
    method: {
      type: String,
      default: 'COD'
    },
    status: {
      type: String,
      default: 'Pending'
    }
  },
  shipping: {
    fullName: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    address: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    },
    zipCode: {
      type: String
    },
    note: {
      type: String,
      trim: true
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      default: null
    },
    isAlternate: {
      type: Boolean,
      default: false
    }
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Order', OrderSchema);
