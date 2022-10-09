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
		this.editHeight = '';

		this.state = {
			editContent: '',
		};

		this.onClick = this.onClick.bind(this);
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
		TextEditor.initial();
	}

	onClick(event) {
		// event.stopPropagation();
		this.focusIndex = EditManager.focusIndex;
	}

	onFocus() {
		this.focusIndex = EditManager.focusIndex;
		this.editHeight = TextEditor.sunEditor.clientHeight;
	}

	onKeyDown(event) {
		if (this.editHeight !== TextEditor.sunEditor.clientHeight) {
			this.editHeight = TextEditor.sunEditor.clientHeight;
			this.handleBlur(event, TextEditor.editorState.getContents());
		}

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
			event.preventDefault();

			this.handleBlur(event, TextEditor.editorState.getContents());

			let div = EditManager.lisEditList[this.focusIndex];
			div.setOutWard();
			TextEditor.moveEditor(
				div.outWard.intX,
				div.outWard.intY + div.outWard.intHeight + 10,
				div.outWard.intWidth,
				div.outWard.intHeight
			);

			EditManager.add(this.focusIndex);
			this.focusIndex += 1;

			TextEditor.editorState.setContents('<p></p>');
			this.setState({ editContent: '<p></p>' });
		} else if (event.key === 'Backspace') {
			let textContent = TextEditor.editorState.getText();

			if (textContent.length === 0) {
				event.preventDefault();

				if (EditManager.lisEditList.length > 1) {
					EditManager.removeItem(this.focusIndex);

					this.focusIndex -= 1;
					let div = EditManager.lisEditList[this.focusIndex];
					div.setOutWard();
					TextEditor.moveEditor(div.outWard.intX, div.outWard.intY, div.outWard.intWidth, div.outWard.intHeight);

					TextEditor.editorState.setContents(div.strHtml);
					TextEditor.focus(TextEditor.editorState.getContents().length - 1);
					this.setState({ editContent: div.strHtml });
				}
			}
		}

		setTimeout(() => {
			Selector.nowCaretIndex = Selector.selector.anchorOffset;
		}, 0);
	}
	#focusNewDiv(focusIndex) {
		EditManager.focusList = EditManager.lisEditList[focusIndex];
		let div = EditManager.lisEditList[focusIndex];
		div.setOutWard();

		TextEditor.moveEditor(div.outWard.intX, div.outWard.intY, div.outWard.intWidth, div.outWard.intHeight);
		TextEditor.focus(Selector.nowCaretIndex);

		TextEditor.editorState.setContents(div.strHtml);
		this.setState({ editContent: div.strHtml });
	}

	handleBlur(event, editContent) {
		if (this.focusIndex === -1 || this.focusIndex === null) return;

		TextEditor.isChanging = true;

		EditManager.lisEditList[this.focusIndex].strHtml = editContent;
		EditManager.lisEditList[this.focusIndex].asynToComponent();

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
				onMouseDown={(event) => {
					event.stopPropagation();
				}}
			></SunEditor>
		);
	}
}
