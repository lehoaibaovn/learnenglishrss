import React from 'react';
import { render } from 'react-dom'
import App from 'Client/App';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { setConfig } from 'react-hot-loader';
import { compose, createStore, applyMiddleware} from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { ConnectedRouter } from 'connected-react-router'
import history from 'Client/history'
import { Provider } from 'react-redux'
import {makeRootReducer, initialState} from './reducers'

import firebase from 'firebase/app';
const rootReducer = makeRootReducer(history);

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================

  const store  = createStore(
    rootReducer, // root reducer with router state
    initialState,
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
      )
    ),
  )



render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
    <App/>
  </ConnectedRouter>
  </Provider>
, document.getElementById('root'));
setConfig({ logLevel: 'debug' })
if (module.hot) {
  console.log('hotmodule');
  module.hot.accept('Client/App', () => {
  });
  store.replaceReducer(rootReducer);
}else{
  console.log('not hotmodule');
}
