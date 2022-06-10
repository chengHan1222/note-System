import React, { Component } from 'react';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import './index.css';
import style from './index.module.scss';

import EditManager from '../../../tools/EditFrame';
import TextEditor from '../../../tools/TextEditor';

export default class sunEditor extends Component {
	constructor(props) {
		super(props);

		this.focusIndex = -1;

		this.state = {
			editContent: '',
		};

		this.onClick = this.onClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);

		// document.addEventListener('mousedown', () => {document.getElementsByClassName('se-wrapper')[0].style.display = 'none'});
	}

	componentDidMount() {
		const myThis = this;
		const setEditor = this.setState;
		TextEditor.asynToComponent = (content) => {
			setEditor.call(myThis, { editContent: content });
		};
	}

	getSunEditorInstance(sunEditor) {
		TextEditor.editorState = sunEditor;
	}

	onClick() {
		// TextEditor.editorState.autoFoucs=true;
		this.focusIndex = EditManager.focusIndex;
	}

	onKeyDown(event) {
		if (event.key === 'Enter') {
		} else if (event.key === 'Backspace') {
			let textContent = TextEditor.editorState.getContents();
			let content = textContent.substring(3, textContent.length - 4);
			if (content === '<br>') {
				EditManager.remove(this.focusIndex);
				this.focusIndex = -1;
			}
		}
	}

	handleChange(content) {
		// console.log(content);
	}

	handleBlur(event, editContent) {
		console.log(this.focusIndex);
		if (this.focusIndex == -1 || !this.focusIndex) return;
		// if (this.focusIndex >= 0 && this.focusIndex) {
		EditManager.lisEditList[this.focusIndex].setContent(editContent);

		EditManager.lisEditList[this.focusIndex].asynToComponent();
		// }
		if (EditManager.getFocusList().getContent() !== TextEditor.editorState.getContents()) {
			TextEditor.editorState.setContents(this.state.editContent);
		}
	}

	render() {
		return (
			<div className={style.toolBar}>
				<SunEditor
					width="100%"
					setOptions={{
						buttonList: [
							['undo', 'redo'],
							['bold', 'underline', 'italic', 'strike', 'list', 'align'],
							['font', 'fontSize', 'formatBlock'],
							['fontColor', 'hiliteColor', 'textStyle'],
							['table', 'image', 'blockquote', 'print'],
						],
					}}
					setDefaultStyle="font-size: 18px"
					placeholder="Please type here..."
					getSunEditorInstance={this.getSunEditorInstance}
					onClick={this.onClick}
					onKeyDown={this.onKeyDown}
					onChange={this.handleChange}
					onBlur={this.handleBlur}
					setContents={this.state.editContent}
				></SunEditor>
			</div>
		);
	}
}
