import {
  UPDATE_AUTH_STATE,
} from 'Constants/actionTypes';
export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_AUTH_STATE:
    return {
      ...state,
      authState: action.value,
      popular: undefined
    }
    default:
      return state
  }
}
