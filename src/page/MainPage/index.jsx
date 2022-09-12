import React, { Component } from 'react';
import style from './index.module.scss';

import ToolBar from './ToolBar';
import FileBar from './FileBar';
import EditFrame from './EditFrame';

import EditManager from '../../tools/EditFrame';
import { StepControl } from '../../tools/IconFunction';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			strTitle: 'title........',
			strFocusFile: '',
			strFocusSpace: '',

			files: [
				{
					folder: 'favorite',
					files: [
						{
							fileName: 'first',
							fileData: `["<h1>File First</h1>","<p>List  0</p>","<p>List  1</p>","<p>List  2</p>","<p>List  3</p>","<p>List  4</p>","<p>List  5</p>","<p>List  6</p>","<p>List  7</p>","<p><strong>123</strong></p>"]`,
							isNaming: false,
						},
						{
							fileName: 'second',
							fileData: `["<h2>File Second</h2>","<p>List  0</p>","<p>List  1</p>","<p>List  2</p>","<p>List  3</p>","<p>List  4</p>","<p>List  5</p>","<p>List  6</p>","<p>List  7</p>","<p><strong>123</strong></p>"]`,
							isNaming: false,
						},
					],
					isNaming: false,
				},
				{
					folder: 'normal',
					files: [
						{
							fileName: 'third',
							fileData: `["<h3>File Third</h3>","<h3>List  0</h3>","<p>List  1</p>","<p>List  2</p>","<p>List  3</p>","<p>List  4</p>","<p>List  5</p>","<p>List  6</p>","<p>List  7</p>","<p><strong>123</strong></p>"]`,
							isNaming: false,
						},
						{
							fileName: 'fourth',
							fileData: `["<h4>Fourth</h4>"]`,
							isNaming: false,
						},
					],
					isNaming: false,
				},
			],
		};

		this.initial();
	}

	initial() {
		this.setFocusFile('normal_fileBtn0');
	}
	// normal_fileBtn1
	setFocusFile(strFocusFile) {
		let detail = strFocusFile.split('_');
		let folder = detail[0];
		let fileNumber = detail[1][detail[1].length - 1];

		let focusFile;
		for (let index = 0; index < this.state.files.length; index++) {
			if (this.state.files[index].folder === folder) {
				focusFile = this.state.files[index];
				break;
			}
		}
		if (focusFile.files[fileNumber].fileData === '' || focusFile.files[fileNumber].fileData === undefined) {
			focusFile.files[fileNumber].fileData = '["<p></p>"]';
		}

		EditManager.readFile(JSON.parse(focusFile.files[fileNumber].fileData));

		StepControl.initial(EditManager.getFile());
		// this.setState({ strFocusFile: strFocusFile });
	}

	handleClick(event) {
		let target = this.findFocusSpace(event.target);
		this.setState({ strFocusSpace: target });
	}

	findFocusSpace(target) {
		if (target.parentNode.id === '' || target.parentNode.id === undefined) return;

		while (!target.parentNode.id.includes('mainSpace')) {
			target = target.parentNode;
		}
		return target.className.includes('editFrame') ? 'EditFrame' : 'FileBar';
	}

	render() {
		return (
			<div
				id={'mainSpace'}
				className={style.mainPage}
				onClick={this.handleClick.bind(this)}
				onContextMenu={this.handleClick.bind(this)}
			>
				<FileBar
					title={this.state.strTitle}
					files={this.state.files}
					funSetFocusFile={this.setFocusFile.bind(this)}
					focusSpace={this.state.strFocusSpace}
				/>

				<div className={style.editFrame}>
					<ToolBar></ToolBar>
					<EditFrame></EditFrame>
				</div>
			</div>
		);
	}
}
