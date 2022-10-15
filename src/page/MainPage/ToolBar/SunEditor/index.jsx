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

		this.onKeyDown = this.onKeyDown.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);

		document.addEventListener('mousedown', (event) => {
			if (document.getElementsByClassName('se-wrapper')[0] === undefined || typeof event.target.className === 'object')
				return;

			let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];

			if (
				event.target !== editor &&
				event.target.parentNode !== editor &&
				event.target.className?.indexOf('se-btn') === -1
			) {
				document.getElementsByClassName('se-wrapper')[0].style.display = 'none';
			}
		});
	}

	static getDerivedStateFromProps(props, state) {
		if (props.windowWidth !== state.windowWidth) {
			return { windowWidth: props.windowWidth };
		}
		return {};
	}

	getSunEditorInstance(sunEditor) {
		TextEditor.editorState = sunEditor;
		TextEditor.initial();
	}

	onFocus() {
		this.focusIndex = EditManager.focusIndex;
	}

	onKeyDown(event) {
		if (event.key === 'ArrowUp') {
			this.#arrowUp(event);
			return;
		} else if (event.key === 'ArrowDown') {
			this.#arrowDown(event);
			return;
		} else if (event.key === 'Enter') {
			event.preventDefault();

			EditManager.add(this.focusIndex);
			setTimeout(() => {
				this.#arrowDown(event);
			}, 50);
			return;
		} else if (event.key === 'Backspace') {
			let textContent = TextEditor.editorState.getText();

			if (textContent.length === 0) {
				event.preventDefault();

				if (EditManager.lisEditList.length > 1) {
					TextEditor.editorState.setContents(EditManager.lisEditList[this.focusIndex + 1].strHtml);
					EditManager.removeItem(this.focusIndex);
					this.#arrowUp(event);
				}
			}
			return;
		}

		setTimeout(() => {
			Selector.nowCaretIndex = Selector.selector.anchorOffset;
		}, 0);
	}
	#arrowUp(event) {
		this.handleBlur(event, TextEditor.editorState.getContents(), this.focusIndex);

		this.focusIndex = this.focusIndex - 1 >= 0 ? this.focusIndex - 1 : 0;
		this.#focusNewDiv(this.focusIndex);
	}
	#arrowDown(event) {
		this.handleBlur(event, TextEditor.editorState.getContents(), this.focusIndex);

		this.focusIndex = this.focusIndex + 1 < EditManager.lisEditList.length ? this.focusIndex + 1 : this.focusIndex;
		this.#focusNewDiv(this.focusIndex);
	}
	#focusNewDiv(focusIndex) {
		let newList = EditManager.lisEditList[focusIndex];
		EditManager.focusList = newList;
		EditManager.focusIndex = focusIndex;
		newList.setSunEditor();

		TextEditor.showEditor();
		TextEditor.editorState.setContents(newList.strHtml);
	}

	handleBlur(event, editContent, oldIndex) {
		if (this.focusIndex === -1 || this.focusIndex === null) return;

		let index = oldIndex ? oldIndex : this.focusIndex;

		TextEditor.isChanging = true;

		EditManager.focusIndex = null;
		let lastList = EditManager.lisEditList[index];
		lastList.strHtml = editContent;
		lastList.asynToComponent();

		StepControl.addStep(EditManager.getFile());

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
				setOptions={{
					buttonList: [
						['bold', 'underline', 'italic', 'strike', 'list', 'align'],
						['font', 'formatBlock'],
						['fontSize'],
						['fontColor', 'hiliteColor', 'textStyle'],
						['table', 'image', 'blockquote', 'print'],
						[
							'%762',
							[
								['bold', 'underline', 'italic', 'strike', 'list', 'align'],
								['font', 'formatBlock'],
								['fontSize'],
								['fontColor', 'hiliteColor', 'textStyle'],
								[':r-More Rich-default.more_plus', 'table', 'image', 'blockquote', 'print'],
							],
						],
						[
							'%652',
							[
								['bold', 'underline', 'italic', 'strike', 'list', 'align'],
								['font', 'formatBlock'],
								['fontSize'],
								[':i-More Misc-default.more_vertical', 'fontColor', 'hiliteColor', 'textStyle'],
								[':r-More Rich-default.more_plus', 'table', 'image', 'blockquote', 'print'],
							],
						],
						[
							'%579',
							[
								['bold', 'underline', 'italic', 'strike', 'list', 'align'],
								[':p-More Paragraph-default.more_paragraph', 'font', 'formatBlock', 'fontSize'],
								[':i-More Misc-default.more_vertical', 'fontColor', 'hiliteColor', 'textStyle'],
								[':r-More Rich-default.more_plus', 'table', 'image', 'blockquote', 'print'],
							],
						],
						[
							'%340',
							[
								[':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'list', 'align'],
								[':p-More Paragraph-default.more_paragraph', 'font', 'formatBlock', 'fontSize'],
								[':i-More Misc-default.more_vertical', 'fontColor', 'hiliteColor', 'textStyle'],
								[':r-More Rich-default.more_plus', 'table', 'image', 'blockquote', 'print'],
							],
						],
					],
				}}
				setDefaultStyle="font-size: 20px"
				placeholder=" "
				getSunEditorInstance={this.getSunEditorInstance}
				onClick={this.onClick}
				onKeyDown={this.onKeyDown}
				onFocus={this.onFocus}
				onBlur={this.handleBlur}
				setContents={this.state.editContent}
				// onCopy={this.handleCopy}
				// onCut={this.handleCut}
				// onPaste={this.handlePaste}
				onMouseDown={(event) => {
					event.stopPropagation();
				}}
			></SunEditor>
		);
	}
}
