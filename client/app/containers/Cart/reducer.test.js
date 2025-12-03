import reducer from './reducer';
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  HANDLE_CART,
  SET_CART_ID,
  CLEAR_CART,
  UPDATE_CART_ITEM
} from './constants';

const baseState = {
  cartItems: [],
  cartTotal: 0,
  cartId: ''
};

describe('cart reducer', () => {
  test('adds and removes products from cart', () => {
    const cartItem = { _id: 'item-1', name: 'Camera' };
    const stateAfterAdd = reducer(baseState, {
      type: ADD_TO_CART,
      payload: cartItem
    });

    expect(stateAfterAdd.cartItems).toHaveLength(1);
    expect(stateAfterAdd.cartItems[0]).toEqual(cartItem);

    const stateAfterRemove = reducer(stateAfterAdd, {
      type: REMOVE_FROM_CART,
      payload: { _id: 'item-1' }
    });

    expect(stateAfterRemove.cartItems).toHaveLength(0);
  });

  test('updates totals, cart id and cached snapshot in HANDLE_CART', () => {
    const populatedState = reducer(baseState, {
      type: HANDLE_CART,
      payload: {
        cartItems: [{ _id: 'b', quantity: 2 }],
        cartTotal: 250,
        cartId: 'cart-99'
      }
    });

    expect(populatedState.cartItems).toHaveLength(1);
    expect(populatedState.cartTotal).toBe(250);
    expect(populatedState.cartId).toBe('cart-99');

    const withManualTotal = reducer(populatedState, {
      type: HANDLE_CART_TOTAL,
      payload: 300
    });

    expect(withManualTotal.cartTotal).toBe(300);

    const withCustomId = reducer(withManualTotal, {
      type: SET_CART_ID,
      payload: 'cart-100'
    });

    expect(withCustomId.cartId).toBe('cart-100');
  });

  test('clears cart and replaces product list when requested', () => {
    const intermediateState = {
      cartItems: [{ _id: 'c1' }, { _id: 'c2' }],
      cartTotal: 99,
      cartId: 'existing'
    };

    const updatedItemsState = reducer(intermediateState, {
      type: UPDATE_CART_ITEM,
      payload: [{ _id: 'c2' }]
    });

    expect(updatedItemsState.cartItems).toEqual([{ _id: 'c2' }]);

    const cleared = reducer(updatedItemsState, { type: CLEAR_CART });
    expect(cleared).toEqual(baseState);
  });
});
