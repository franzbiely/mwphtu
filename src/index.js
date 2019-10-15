import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/global.css';
import App from './components/App';

window.HOW_TO_USE = App;

// npm run build will set NODE_ENV to 'production'
if (process.env.NODE_ENV === 'development') {
    ReactDOM.render(<App />, document.getElementById('root'));
}