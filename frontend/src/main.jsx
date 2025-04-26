import React from 'react';
import ReactDOM from 'react-dom/client';  // or ReactDOM from 'react-dom' if you're using older versions
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
