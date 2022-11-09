import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './page/Welcome';
import MainPage from './page/MainPage';
import Test from './page/Test';
import NotFound from './page/NotFound';

// const MainPage = lazy(() => import("./page/MainPage"));
// const Test = lazy(() => import("./page/Test"));
// const NotFound = lazy(() => import("./page/NotFound"))

function App() {
	return (
		<Router>
			<Suspense fallback={<h4>Web is loading...</h4>}>
				<Routes>
					<Route path="/" element={<Welcome />}></Route>
					<Route path="/MainPage" element={<MainPage />}></Route>
					<Route path="/Test" element={<Test />}></Route>
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</Suspense>
		</Router>
	);
}

export default App;
