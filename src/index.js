import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
// import 'jquery/dist/jquery.min.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import { App } from './components';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, HashRouter, useHistory } from 'react-router-dom';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { configStore } from './reduxManager';



const { store, persistor } = configStore();
ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <HashRouter history={useHistory} basename="/">
        {/* <BrowserRouter basename="/SGLearningAdmin"  > */}
        <App />
      </HashRouter>
      {/* </BrowserRouter> */}
    </PersistGate>
    {/* / </Router> */}
  </Provider>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
