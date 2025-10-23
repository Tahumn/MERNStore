/*
 *
 * Dashboard actions
 *
 */

import axios from 'axios';

import {
  TOGGLE_DASHBOARD_MENU,
  FETCH_DASHBOARD_SUMMARY,
  SET_DASHBOARD_LOADING
} from './constants';
import { API_URL } from '../../constants';
import handleError from '../../utils/error';

export const toggleDashboardMenu = () => {
  return {
    type: TOGGLE_DASHBOARD_MENU
  };
};

export const fetchDashboardSummary = () => {
  return async dispatch => {
    try {
      dispatch({ type: SET_DASHBOARD_LOADING, payload: true });

      const response = await axios.get(`${API_URL}/dashboard/summary`);

      dispatch({
        type: FETCH_DASHBOARD_SUMMARY,
        payload: response.data
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_DASHBOARD_LOADING, payload: false });
    }
  };
};
