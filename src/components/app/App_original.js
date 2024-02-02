import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import './App.scss'
// Toastify
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import AppRoutes from './../../routes/index';
import { Provider } from 'react-redux'
import store from '../../ReduxManager/Store';


const App = ()  => {
	return (
		<Provider store={store}>
		<Router>
			<ToastContainer autoClose={2000} position="bottom-left" />
			<div className="App">
				<AppRoutes />
			</div>
		</Router>
		</Provider>
	);
}

export default App;
