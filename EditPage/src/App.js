import './App.css';
import ToolBar from './component/ToolBar';
import FileBar from './component/FileBar';
import EditFrame from './component/EditFrame';

function App() {
	return (
		<div className="App">
			<FileBar></FileBar>
			<div>
				<ToolBar></ToolBar>
				<EditFrame></EditFrame>
			</div>
		</div>
	);
}

export default App;
