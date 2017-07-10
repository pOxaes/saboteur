import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './scripts/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

// import Home from './scripts/components/Home';

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
