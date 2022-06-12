import React, { Component } from 'react';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import './index.scss';

import EditManager from '../../../../tools/EditFrame';
import TextEditor from '../../../../tools/TextEditor';

export default class index extends Component {
	constructor(props) {
		super(props);

		this.focusIndex = -1;

		this.state = {
			editContent: '',
		};

		this.onClick = this.onClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.handleBlur = this.handleBlur.bind(this);

		document.addEventListener('mousedown', (event) => {
			let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
			if (event.target !== editor && event.target.parentNode !== editor) {
				document.getElementsByClassName('se-wrapper')[0].style.display = 'none';
			}
		});
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
			let div = EditManager.lisEditList[this.focusIndex];
			TextEditor.moveEditor(div.outWard.intY + div.outWard.intHeight + 10, div.outWard.intWidth, div.outWard.intHeight);

			EditManager.add(this.focusIndex);
			this.focusIndex += 1;

			TextEditor.editorState.setContents(EditManager.lisEditList[this.focusIndex].getContent());
			this.setState({ editContent: EditManager.lisEditList[this.focusIndex].getContent() });

			console.log(TextEditor.editorState.getContents());
		} else if (event.key === 'Backspace') {
			let textContent = TextEditor.editorState.getContents();
			let content = textContent.substring(3, textContent.length - 4);
			if (content === '<br>') {
				EditManager.remove(this.focusIndex);
				this.focusIndex -= 1;
				let div = EditManager.lisEditList[this.focusIndex];
				TextEditor.moveEditor(div.outWard.intY, div.outWard.intWidth, div.outWard.intHeight);

				TextEditor.editorState.setContents(div.getContent());
				this.setState({ editContent: div.getContent() });
			}
		}
	}

	handleBlur(event, editContent) {
		console.log(this.focusIndex);
		if (this.focusIndex === -1 || this.focusIndex === null) return;
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
			<>
				<SunEditor
					width="80%"
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
					onBlur={this.handleBlur}
					setContents={this.state.editContent}
				></SunEditor>
			</>
		);
	}
}
