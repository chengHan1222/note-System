import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './page/Welcome';
import MainPage from './page/MainPage';
import Test from './page/Test';
import NotFound from './page/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/MainPage" element={<MainPage />}></Route>
        <Route path="/Test" element={<Test />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
