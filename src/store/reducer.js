// third party
import { combineReducers } from 'redux';

// project import
import customizationReducer from './customizationReducer';
import searchReducer from './searchReducer';

// ==============================|| REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  search: searchReducer
});

export default reducer;
