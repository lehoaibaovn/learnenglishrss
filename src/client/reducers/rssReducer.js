import {isEmpty} from "Utils"
import {
  GET_RSSS, SEARCH_QUERY, UPDATE_RSS_ITEM
} from 'Constants/actionTypes';
function updateRss(list, item){
  if(list){
    return list.map((content, i) => content.id
    === item.id ? item : content)
  }
  return list
}
export default (state = {}, action) => {
  switch (action.type) {
    case SEARCH_QUERY:
    return {
      ...state,
      searchQuery: action.value
    }
    case UPDATE_RSS_ITEM:
    const updated = {
        ...state,
        popular: updateRss(state.popular, action.value)
     }
     return updated
    case GET_RSSS:
    var popular
    if(state.popular && !action.clear){
      popular = [...state.popular, ...action.value]
    }else{
      popular = action.value
    }
    return {
      ...state,
      popular: popular
    }
    default:
      return state
  }
}
