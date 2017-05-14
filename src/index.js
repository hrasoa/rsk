import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import postsApp from './reducers/postsApp';
import './style.scss';

let store = createStore(postsApp, window.initialState);

delete window.initialState;

const render = () => {
  const App = require('./components/App').default;
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render();

if (module.hot) {
  module.hot.accept('./components/App', render);
  module.hot.accept('./reducers/postsApp', () => {
    const nextRootReducer = require('./reducers/postsApp');
    store.replaceReducer(nextRootReducer);
  });
}
