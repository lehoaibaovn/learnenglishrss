import { combineReducers } from 'redux';
import rss from './rssReducer'
import user from './userReducer'
import report from './reportReducer'

export const initialState = {
  rss: {
    popular: undefined
  },
};

export const makeRootReducer = () => {
  return combineReducers({
    rss,
    user,
    report
  })
}
export default makeRootReducer
