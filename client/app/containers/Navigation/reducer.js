/*
 *
 * Navigation reducer
 *
 */

import {
  TOGGLE_MENU,
  TOGGLE_BRAND,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_CLEAR_REQUEST
} from './constants';

const initialState = {
  isMenuOpen: false,
  isBrandOpen: false,
  searchValue: '',
  searchSuggestions: []
};

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };
    case TOGGLE_BRAND:
      return {
        ...state,
        isBrandOpen: !state.isBrandOpen
      };
    case SEARCH_CHANGE:
      return {
        ...state,
        searchValue: action.payload
      };
    case SUGGESTIONS_FETCH_REQUEST:
      return {
        ...state,
        searchSuggestions: action.payload
      };
    case SUGGESTIONS_CLEAR_REQUEST:
      return {
        ...state,
        searchSuggestions: action.payload
      };
    default:
      return state;
  }
};

export default navigationReducer;
