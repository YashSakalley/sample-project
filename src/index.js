import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'
import App from './App';
import reducer from './store/reducer';

require('dotenv').config();
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);