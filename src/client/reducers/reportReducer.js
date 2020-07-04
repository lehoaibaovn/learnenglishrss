import {isEmpty} from "Utils"
import {
  GET_REPORT_ITEMS
} from 'Constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_REPORT_ITEMS:
    var items
    if(state.items && !action.clear){
      items = [...state.items, ...action.value]
    }else{
      items = action.value
    }
    return {
      ...state,
      items: items
    }
    default:
      return state
  }
}
