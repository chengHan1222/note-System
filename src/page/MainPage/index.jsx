import React, { Component } from 'react';
import style from './index.module.scss'

import ToolBar from './ToolBar';
import FileBar from './FileBar';
import EditFrame from './EditFrame';
import FileRightClickBlock from './FileBar/fileRightClickBlock';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			strTitle: 'title........',
			strFocusFile: "",
			strFocusSpace: "",
			
			files: [
				{folder: "favorite",
				files: [
					{fileName: "first",
					fileData: `List  0/*/List  1/*/List  2/*/List  3/*/List  4/*/List  5/*/List  6/*/List  7/*/<strong>123</strong>/*/`,
					isNaming: false}, 
					{fileName: "second", 
					fileData: `List  0/*/List  1/*/List  2/*/List  3/*/List  4/*/List  5/*/List  6/*/List  7/*/<strong>123</strong>/*/`,
					isNaming: false}
				],
				isNaming: false},
				{folder: "normal",
				files: [
					{fileName: "third",
					fileData: `List  0/*/List  1/*/List  2/*/List  3/*/List  4/*/List  5/*/List  6/*/List  7/*/<strong>123</strong>/*/`,
					isNaming: false}, 
					{fileName: "forth", 
					fileData: `List  0/*/List  1/*/List  2/*/List  3/*/List  4/*/List  5/*/List  6/*/List  7/*/<strong>123</strong>/*/`,
					isNaming: false}
				],
				isNaming: false}
			]
		}
	}

	setFocusFile(strFocusFile) {
		this.setState({strFocusFile: strFocusFile});
		console.log("strFocusFile", strFocusFile)
	}

	handleClick(event) {
		let target = this.findFocusSpace(event.target);
		this.setState({focusSpace: target})
	}

	findFocusSpace(target) {
		while (!target.parentNode.id.includes("mainSpace")) {
			target = target.parentNode;
		}
		return (target.className.includes("editFrame"))? "EditFrame": "FileBar";
	}

	render() {
		return (
			<div id={"mainSpace"}
				className={style.mainPage}
				onClick={this.handleClick.bind(this)}
				onContextMenu={this.handleClick.bind(this)}
			>
				<FileBar title={this.state.strTitle} 
					files={this.state.files} 
					funSetFocusFile={this.setFocusFile.bind(this)}
					focusSpace={this.state.focusSpace}
				/>

				<div className={style.editFrame}>
					<ToolBar></ToolBar>
					<EditFrame></EditFrame>
				</div>
			</div>
		);
	}
}
