/*
 *
 * Cart actions
 *
 */

import { push } from 'connected-react-router';
import { success, error as notifyError } from 'react-notification-system-redux';
import axios from 'axios';

import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART,
  UPDATE_CART_ITEM
} from './constants';

import {
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT_SHOP
} from '../Product/constants';

import { API_URL, CART_ID, CART_ITEMS, CART_TOTAL } from '../../constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';

// Handle Add To Cart
export const handleAddToCart = product => {
  return (dispatch, getState) => {
    const state = getState();
    const selectedQuantity = Number(state.product.productShopData.quantity);
    const inventory = product?.inventory ?? product?.quantity ?? 0;

    product.quantity = selectedQuantity;
    product.totalPrice = product.quantity * product.price;
    product.totalPrice = parseFloat(product.totalPrice.toFixed(2));
    product.inventory = inventory;

    const result = calculatePurchaseQuantity(inventory);

    const rules = {
      quantity: `min:1|max:${result}`
    };

    const { isValid, errors } = allFieldsValidation(product, rules, {
      'min.quantity': 'Quantity must be at least 1.',
      'max.quantity': `Quantity may not be greater than ${result}.`
    });

    if (!isValid) {
      return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors });
    }

    dispatch({
      type: RESET_PRODUCT_SHOP
    });

    dispatch({
      type: ADD_TO_CART,
      payload: product
    });

    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
    let newCartItems = [];
    if (cartItems) {
      newCartItems = [...cartItems, product];
    } else {
      newCartItems.push(product);
    }
    localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

    dispatch(calculateCartTotal());
  };
};

// Handle Remove From Cart
export const handleRemoveFromCart = product => {
  return (dispatch, getState) => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
    const newCartItems = cartItems.filter(item => item._id !== product._id);
    localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

    dispatch({
      type: REMOVE_FROM_CART,
      payload: product
    });
    dispatch(calculateCartTotal());
  };
};

export const updateCartItemQuantity = (productId, quantity) => {
  return (dispatch, getState) => {
    const sanitizedQuantity = Math.max(Number(quantity) || 1, 1);

    const cartItems = getState().cart.cartItems.map(item => {
      if (item._id === productId) {
        const available =
          item?.inventory ??
          item?.quantityAvailable ??
          item?.stock ??
          item?.quantity ??
          sanitizedQuantity;
        const clampedQuantity = Math.min(sanitizedQuantity, available);
        const updated = {
          ...item,
          quantity: clampedQuantity,
          totalPrice: parseFloat((item.price * clampedQuantity).toFixed(2))
        };

        return updated;
      }

      return item;
    });

    localStorage.setItem(CART_ITEMS, JSON.stringify(cartItems));

    dispatch({
      type: UPDATE_CART_ITEM,
      payload: cartItems
    });

    dispatch(calculateCartTotal());
  };
};

export const startCheckout = () => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cartItems;

    if (!cartItems || cartItems.length < 1) {
      return;
    }

    localStorage.removeItem(CART_ID);
    dispatch(push('/checkout'));
  };
};

export const quickAddToCart = product => {
  return (dispatch, getState) => {
    if (!product || !product._id) {
      return;
    }

    const inventory =
      product?.inventory ?? product?.quantity ?? product?.available ?? 0;

    if (!inventory || inventory < 1) {
      dispatch(
        notifyError({
          title: 'This product is currently out of stock.',
          position: 'tr',
          autoDismiss: 2
        })
      );
      return;
    }

    const cartItems = getState().cart.cartItems;
    const existingItem = cartItems.find(item => item._id === product._id);
    let updatedItems = [];

    if (existingItem) {
      const nextQuantity = Math.min(existingItem.quantity + 1, inventory);

      if (nextQuantity === existingItem.quantity) {
        dispatch(
          notifyError({
            title: 'Maximum available quantity already in cart.',
            position: 'tr',
            autoDismiss: 2
          })
        );
        return;
      }

      updatedItems = cartItems.map(item =>
        item._id === product._id
          ? {
              ...item,
              quantity: nextQuantity,
              totalPrice: parseFloat((item.price * nextQuantity).toFixed(2)),
              inventory
            }
          : item
      );

      localStorage.setItem(CART_ITEMS, JSON.stringify(updatedItems));

      dispatch({
        type: UPDATE_CART_ITEM,
        payload: updatedItems
      });
    } else {
      const newItem = {
        ...product,
        quantity: 1,
        totalPrice: parseFloat(Number(product.price).toFixed(2)),
        inventory
      };

      updatedItems = [...cartItems, newItem];
      localStorage.setItem(CART_ITEMS, JSON.stringify(updatedItems));

      dispatch({
        type: ADD_TO_CART,
        payload: newItem
      });
    }

    dispatch(calculateCartTotal());
  };
};

export const calculateCartTotal = () => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cartItems;

    let total = 0;

    cartItems.map(item => {
      total += item.price * item.quantity;
    });

    total = parseFloat(total.toFixed(2));
    localStorage.setItem(CART_TOTAL, total);
    dispatch({
      type: HANDLE_CART_TOTAL,
      payload: total
    });
  };
};

// set cart store from local storage
export const handleCart = () => {
  const cart = {
    cartItems: JSON.parse(localStorage.getItem(CART_ITEMS)),
    cartTotal: localStorage.getItem(CART_TOTAL),
    cartId: localStorage.getItem(CART_ID)
  };

  return (dispatch, getState) => {
    if (cart.cartItems != undefined) {
      dispatch({
        type: HANDLE_CART,
        payload: cart
      });
      dispatch(calculateCartTotal());
    }
  };
};

export const handleCheckout = () => {
  return (dispatch, getState) => {
    const successfulOptions = {
      title: `Please Login to proceed to checkout`,
      position: 'tr',
      autoDismiss: 1
    };

    dispatch(push('/login'));
    dispatch(success(successfulOptions));
  };
};

// Continue shopping use case
export const handleShopping = () => {
  return (dispatch, getState) => {
    dispatch(push('/shop'));
  };
};

// create cart id api
export const getCartId = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem(CART_ID);
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);

      // create cart id if there is no one
      if (!cartId) {
        const response = await axios.post(`${API_URL}/cart/add`, { products });

        dispatch(setCartId(response.data.cartId));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const setCartId = cartId => {
  return (dispatch, getState) => {
    localStorage.setItem(CART_ID, cartId);
    dispatch({
      type: SET_CART_ID,
      payload: cartId
    });
  };
};

export const clearCart = () => {
  return (dispatch, getState) => {
    localStorage.removeItem(CART_ITEMS);
    localStorage.removeItem(CART_TOTAL);
    localStorage.removeItem(CART_ID);

    dispatch({
      type: CLEAR_CART
    });
  };
};

const getCartItems = cartItems => {
  const newCartItems = [];
  cartItems.map(item => {
    const newItem = {};
    newItem.quantity = item.quantity;
    newItem.price = item.price;
    newItem.taxable = item.taxable;
    newItem.product = item._id;
    newCartItems.push(newItem);
  });

  return newCartItems;
};

const calculatePurchaseQuantity = inventory => {
  if (!inventory || inventory < 1) {
    return 1;
  }

  return Number(inventory);
};
