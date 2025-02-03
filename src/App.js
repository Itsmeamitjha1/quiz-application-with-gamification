import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Quiz from './components/quiz';

const App = () => (
  <Provider store={store}>
    <Quiz />
  </Provider>
);

export default App;
