// simple global search reducer for header search

// action types
const SET_QUERY = 'search/setQuery';

// action creators
export const setSearchQuery = (query) => ({ type: SET_QUERY, payload: query });

// reducer
const initialState = {
  query: ''
};

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_QUERY:
      return { ...state, query: action.payload };
    default:
      return state;
  }
}










