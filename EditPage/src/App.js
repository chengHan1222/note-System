import {useState} from 'react';
import './App.css';
import ToolBar from './component/ToolBar';
import FileBar from './component/FileBar';
import EditFrame from './component/EditFrame';

function App() {
	const [title, changeTitle] = new useState("index");

	function change() {
		changeTitle("banana");
	}

	return (
		<div className="App">
			<FileBar title={title}></FileBar>
			<div className='mainPage'>
				<ToolBar ></ToolBar>
				<EditFrame></EditFrame>
				{/* <input type="button" value="click me" onClick={change}></input> */}
			</div>
		</div>
	);
}

export default App;
