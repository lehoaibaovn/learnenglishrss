import React from 'react';
import { render } from 'react-dom'
import App from 'Client/App';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { compose, createStore, applyMiddleware} from 'redux'
import history from 'Client/history'
import { Provider } from 'react-redux'
import {makeRootReducer, initialState} from './reducers'

import { Router } from "react-router-dom";
const rootReducer = makeRootReducer(history);

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================

  const store  = createStore(
    rootReducer, // root reducer with router state
    initialState
  )



render(
  <Provider store={store}>
    <Router history={history}>
    <App/>
  </Router>
  </Provider>
, document.getElementById('root'));
if (module.hot) {
  console.log('hotmodule');
  module.hot.accept('Client/App', () => {
  });
  store.replaceReducer(rootReducer);
}else{
  console.log('not hotmodule');
}
