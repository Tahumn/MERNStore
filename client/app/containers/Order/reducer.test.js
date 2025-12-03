import reducer from './reducer';
import {
  FETCH_ORDERS,
  FETCH_SEARCHED_ORDERS,
  FETCH_ORDER,
  SET_ADVANCED_FILTERS,
  UPDATE_ORDER_STATUS,
  SET_ORDERS_LOADING,
  CLEAR_ORDERS
} from './constants';

const initialState = reducer(undefined, { type: '@@INIT' });

describe('order reducer', () => {
  test('stores fetched orders and searched orders independently', () => {
    const ordersState = reducer(initialState, {
      type: FETCH_ORDERS,
      payload: [{ _id: 'order-1' }]
    });
    expect(ordersState.orders).toHaveLength(1);

    const searchedState = reducer(ordersState, {
      type: FETCH_SEARCHED_ORDERS,
      payload: [{ _id: 'order-2' }]
    });

    expect(searchedState.searchedOrders).toEqual([{ _id: 'order-2' }]);
  });

  test('updates single order snapshot and advanced filters', () => {
    const orderPayload = {
      _id: 'order-10',
      cartId: 'cart-1',
      products: [{ _id: 'item-1', status: 'Pending' }],
      total: 444,
      totalTax: 44
    };

    const withOrder = reducer(initialState, {
      type: FETCH_ORDER,
      payload: orderPayload
    });

    expect(withOrder.order).toEqual(orderPayload);

    const withFilters = reducer(withOrder, {
      type: SET_ADVANCED_FILTERS,
      payload: { totalPages: 4, currentPage: 2, count: 88 }
    });

    expect(withFilters.advancedFilters).toEqual({
      totalPages: 4,
      currentPage: 2,
      count: 88
    });
  });

  test('updates order item status, loading state and supports clearing list', () => {
    const populatedOrder = {
      ...initialState,
      order: {
        ...initialState.order,
        products: [
          { _id: 'item-x', status: 'Pending' },
          { _id: 'item-y', status: 'Delivered' }
        ]
      },
      orders: [{ _id: 'o-1' }]
    };

    const statusUpdated = reducer(populatedOrder, {
      type: UPDATE_ORDER_STATUS,
      payload: { itemId: 'item-x', status: 'Completed' }
    });

    expect(statusUpdated.order.products[0].status).toBe('Completed');

    const loadingState = reducer(statusUpdated, {
      type: SET_ORDERS_LOADING,
      payload: true
    });

    expect(loadingState.isLoading).toBe(true);

    const cleared = reducer(loadingState, { type: CLEAR_ORDERS });
    expect(cleared.orders).toHaveLength(0);
  });
});
