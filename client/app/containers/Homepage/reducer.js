/*
 *
 * Homepage reducer
 *
 */

import {
  DEFAULT_ACTION,
  FETCH_FEATURED_PRODUCTS,
  SET_FEATURED_LOADING,
  FETCH_POPULAR_PRODUCTS,
  SET_POPULAR_LOADING
} from './constants';

const initialState = {
  featuredProducts: [],
  popularProducts: [],
  isLoading: false,
  isPopularLoading: false
};

const homepageReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FEATURED_PRODUCTS:
      return {
        ...state,
        featuredProducts: action.payload
      };
    case SET_FEATURED_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_POPULAR_PRODUCTS:
      return {
        ...state,
        popularProducts: action.payload
      };
    case SET_POPULAR_LOADING:
      return {
        ...state,
        isPopularLoading: action.payload
      };
    case DEFAULT_ACTION:
    default:
      return state;
  }
};

export default homepageReducer;
