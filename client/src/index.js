import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ConsoleApp from './components/ConsoleApp';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";

import {composeWithDevTools} from "redux-devtools-extension";
import {rootReducer} from "./store/configureStore";

const store = createStore(rootReducer, composeWithDevTools(
    // applyMiddleware(...middleware),
));

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <ConsoleApp />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
