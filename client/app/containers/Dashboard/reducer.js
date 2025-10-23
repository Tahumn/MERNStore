/*
 *
 * Dashboard reducer
 *
 */

import {
  TOGGLE_DASHBOARD_MENU,
  FETCH_DASHBOARD_SUMMARY,
  SET_DASHBOARD_LOADING
} from './constants';

const initialState = {
  isMenuOpen: false,
  isLoading: false,
  hasLoaded: false,
  summary: {
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
    customers: 0,
    products: 0
  },
  recentOrders: [],
  topProducts: []
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DASHBOARD_MENU:
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };
    case SET_DASHBOARD_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_DASHBOARD_SUMMARY:
      return {
        ...state,
        summary: {
          ...state.summary,
          ...(action.payload?.summary ?? {})
        },
        recentOrders: action.payload?.recentOrders ?? [],
        topProducts: action.payload?.topProducts ?? [],
        hasLoaded: true
      };
    default:
      return state;
  }
};

export default dashboardReducer;
