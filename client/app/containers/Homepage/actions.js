/*
 *
 * Homepage actions
 *
 */

import axios from 'axios';

import {
  DEFAULT_ACTION,
  FETCH_FEATURED_PRODUCTS,
  SET_FEATURED_LOADING,
  FETCH_POPULAR_PRODUCTS,
  SET_POPULAR_LOADING
} from './constants';
import { API_URL } from '../../constants';
import handleError from '../../utils/error';

export const defaultAction = () => {
  return {
    type: DEFAULT_ACTION
  };
};

export const fetchFeaturedProducts = () => {
  return async dispatch => {
    try {
      dispatch({ type: SET_FEATURED_LOADING, payload: true });

      const response = await axios.get(`${API_URL}/product/featured`);

      dispatch({
        type: FETCH_FEATURED_PRODUCTS,
        payload: response.data.products
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_FEATURED_LOADING, payload: false });
    }
  };
};

export const fetchPopularProducts = (params = {}) => {
  return async dispatch => {
    try {
      dispatch({ type: SET_POPULAR_LOADING, payload: true });

      const response = await axios.get(`${API_URL}/product/popular`, {
        params: { limit: 8, ...params }
      });

      dispatch({
        type: FETCH_POPULAR_PRODUCTS,
        payload: response.data.products
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_POPULAR_LOADING, payload: false });
    }
  };
};
