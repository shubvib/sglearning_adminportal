import React, { useEffect } from 'react';
import './App.css';
import './App.scss';
//import { BrowserRouter as Router } from 'react-router-dom';
import { PublicRoutes, AuthRoutes } from '../../routes';
import { Navbar, Footer, Sidebar } from '../../components';
import { Provider } from 'react-redux';
import { configStore, getStore } from '../../reduxManager';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Network } from '../../services';


toast.configure();

const App = (props) => {
	let particleConfig = {
		r: 8,  // radius
		s: 1.9,  // speed
		acc: 0.65,  // acceleration
		maxS: 7,  // max speed
		sb: 11,  // shadow blur
		colors: [  // list of possible colors
			"#12D800",
			"#B8860B",
			"#9400D3",
			"#008000",
			"#4682B4",
			"#FF6347",
			"#663399"
		]
	};
	window.onload = window.localStorage.clear();
	const { store, persistor } = configStore();
	useEffect(() => {
		if (props.authDetails && props.authDetails.token) {
			const token = Network.getToken();
			if (!token) {
				Network.setToken(props.authDetails.token);
			}
		}

		return () => {

		}
	}, [])
	const publiceRouteComponent = () => {
		return (

			<div className="container-scroller">
				<div className="container-fluid page-body-wrapper full-page-wrapper">
					<div className="main-panel">
						<div className="content-wrapper">

							<PublicRoutes />
						</div>
					</div>
				</div>
			</div>
		)
	}

	const authRouteComponent = () => {
		return (
			<div className="container-scroller">

				<Navbar />
				<div className="container-fluid page-body-wrapper">
					<Sidebar />
					<div className="main-panel">
						<div className="content-wrapper">
							<AuthRoutes />
						</div>
						<Footer />
					</div>
				</div>
			</div>
		)
	}

	return (
		// <Provider store={store}>
		// <Router>
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
				<div>
					{
						props.authDetails && props.authDetails.token ?
							// {1 == 1 ?
							authRouteComponent()
							:
							publiceRouteComponent()
					}
				</div>
			</PersistGate>
			{/* / </Router> */}
		</Provider>
	);
}

const mapPropsToState = (state) => {
	return {
		userData: state.userData,
		authDetails: state.authDetails
	}
}
export default connect(mapPropsToState)(App);

// export default App;


// <div className="container-scroller">
// 	{navbarComponent}
// 	<div className="container-fluid page-body-wrapper">
// 		{sidebarComponent}
// 		<div className="main-panel">
// 			<div className="content-wrapper">
// 				<AppRoutes />
// 			</div>
// 			{footerComponent}
// 		</div>
// 	</div>
// </div>