import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'
import App from './App';
import characterReducer from './store/Character/reducer';
import episodeReducer from './store/Episode/reducer';

require('dotenv').config();
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const rootReducer = combineReducers({
    chrs: characterReducer,
    eps: episodeReducer
})

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);