import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './page/Welcome';
import MainPage from './page/MainPage';
import ResetPassword from './page/ResetPassword'
import NotFound from './page/NotFound';
import Loading from './page/Loading';

function App() {
	return (
		<Router>
			<Suspense fallback={<Loading />}>
				<Routes>
					<Route path="/" element={<Welcome />}></Route>
					<Route path="/MainPage" element={<MainPage />}></Route>
					<Route path="/ResetPassword" element={<ResetPassword />}></Route>
					<Route path="/ResetPassword/*" element={<ResetPassword />}></Route>
					<Route path="/Loading" element={<Loading />}></Route>
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</Suspense>
		</Router>
	);
}

export default App;
