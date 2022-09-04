import React, { Component } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import './index.scss';

import EditManager from '../../../../tools/EditFrame';
import TextEditor, { Selector } from '../../../../tools/TextEditor';
import { StepControl } from '../../../../tools/IconFunction';

export default class index extends Component {
	constructor(props) {
		super(props);

		this.focusIndex = -1;

		this.state = {
			editContent: '',
		};

		this.onClick = this.onClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		// this.handleCopy = this.handleCopy.bind(this);
		// this.handleCut = this.handleCut.bind(this);
		// this.handlePaste = this.handlePaste.bind(this);

		document.addEventListener('mousedown', (event) => {
			let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];

			if (
				event.target !== editor &&
				event.target.parentNode !== editor &&
				event.target.className.indexOf('se-btn') === -1
			) {
				document.getElementsByClassName('se-wrapper')[0].style.display = 'none';
			}
		});
	}

	componentDidMount() {
		const myThis = this;
		const setEditor = this.setState;
		TextEditor.asynToComponent = (content) => {
			setEditor.call(myThis, { editContent: content });

			setTimeout(() => {
				TextEditor.focus();
			}, 10);
		};
	}

	getSunEditorInstance(sunEditor) {
		TextEditor.editorState = sunEditor;
	}

	onClick(event) {
		event.stopPropagation();
		this.focusIndex = EditManager.focusIndex;
	}

	onFocus() {
		this.focusIndex = EditManager.focusIndex;
	}

	onKeyDown(event) {
		if (event.key === 'ArrowUp') {
			this.handleBlur(event, TextEditor.editorState.getContents());

			this.focusIndex = this.focusIndex - 1 >= 0 ? this.focusIndex - 1 : 0;
			this.#focusNewDiv(this.focusIndex);

			return;
		} else if (event.key === 'ArrowDown') {
			this.handleBlur(event, TextEditor.editorState.getContents());

			this.focusIndex = this.focusIndex + 1 < EditManager.lisEditList.length ? this.focusIndex + 1 : this.focusIndex;
			this.#focusNewDiv(this.focusIndex);

			return;
		} else if (event.key === 'Enter') {
			this.handleBlur(event, TextEditor.editorState.getContents());

			let div = EditManager.lisEditList[this.focusIndex];
			div.setOutWard();
			TextEditor.moveEditor(div.outWard.intX, div.outWard.intY + div.outWard.intHeight + 10, div.outWard.intWidth, div.outWard.intHeight);

			EditManager.add(this.focusIndex);
			this.focusIndex += 1;

			TextEditor.editorState.setContents('');
			this.setState({ editContent: EditManager.lisEditList[this.focusIndex].strHtml });
		} else if (event.key === 'Backspace') {
			let textContent = TextEditor.editorState.getContents();
			let content = textContent.substring(3, textContent.length - 4);
			if (content === '<br>') {
				EditManager.remove(this.focusIndex);

				this.focusIndex -= 1;
				let div = EditManager.lisEditList[this.focusIndex];
				div.setOutWard();
				TextEditor.moveEditor(div.outWard.intX, div.outWard.intY, div.outWard.intWidth, div.outWard.intHeight);

				TextEditor.editorState.setContents(div.strHtml);
				this.setState({ editContent: div.strHtml });
			}
		}

		setTimeout(() => {
			Selector.nowCaretIndex = Selector.selector.anchorOffset;
		}, 0);
	}
	#focusNewDiv(focusIndex) {
		let div = EditManager.lisEditList[focusIndex];
		div.setOutWard();

		TextEditor.moveEditor(div.outWard.intX, div.outWard.intY, div.outWard.intWidth, div.outWard.intHeight);
		TextEditor.focus(Selector.nowCaretIndex);

		TextEditor.editorState.setContents(div.strHtml);
		this.setState({ editContent: div.strHtml });
	}

	handleBlur(event, editContent) {
		if (this.focusIndex === -1 || this.focusIndex === null) return;
		if (EditManager.lisEditList[this.focusIndex].strHtml === editContent) return;

		TextEditor.isChanging = true;

		EditManager.lisEditList[this.focusIndex].strHtml = editContent;
		EditManager.lisEditList[this.focusIndex].asynToComponent();

		StepControl.addStep(EditManager.getJSON());
		// StepControl.addStep(JSON.stringify(EditManager.lisEditList));

		TextEditor.isChanging = false;
	}

	// handleCopy(e, clipboardData) {
	// 	console.log(e, clipboardData);
	// }
	// handleCut(e, clipboardData) {
	// 	console.log(e, clipboardData);
	// }
	// handlePaste(e, cleanData, maxCharCount) {
	// 	console.log(e, cleanData, maxCharCount);
	// }

	render() {
		return (
			<SunEditor
				width="80%"
				setOptions={{
					buttonList: [
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
				onFocus={this.onFocus}
				onBlur={this.handleBlur}
				setContents={this.state.editContent}
				// onCopy={this.handleCopy}
				// onCut={this.handleCut}
				// onPaste={this.handlePaste}
			></SunEditor>
		);
	}
}
