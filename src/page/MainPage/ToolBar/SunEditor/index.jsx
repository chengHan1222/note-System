import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import './index.scss';

import EditManager from '../../../../tools/EditFrame';
import TextEditor, { Selector } from '../../../../tools/TextEditor';
import StepControl from '../../../../tools/StepControl';

const { useEffect, useState, useRef, useImperativeHandle } = React;

const Editor = ({ cRef, saveFile }) => {
	let time = 0;

	const autoSave = setInterval(() => {
		time = time - 1;
		if (time == 0) {
			saveFile();
		}
	}, 1000)

	const focusIndex = useRef(-1);
	const [editContent, setEditContent] = useState('');

	useEffect(() => {
		TextEditor.asynToComponent = (content) => {
			setEditContent(content);
		};

		document.addEventListener('mousedown', (event) => {
			if (document.getElementsByClassName('se-wrapper')[0] === undefined || typeof event.target.className === 'object') return;

			let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];

			if (event.target !== editor && event.target.parentNode !== editor && event.target.className?.indexOf('se-btn') === -1) {
				document.getElementsByClassName('se-wrapper')[0].style.display = 'none';
			}
		});
		window.addEventListener('keydown', (event) => {
			// 阻止scroll
			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.preventDefault();
				return false;
			}
		});
	}, []);

	const getSunEditorInstance = (sunEditor) => {
		TextEditor.editorState = sunEditor;
		TextEditor.initial();
	};

	const onFocus = () => (focusIndex.current = EditManager.focusIndex);

	const onKeyDown = (event) => {
		if (event.key === 'ArrowUp') {
			let editContent = TextEditor.editorState.getContents();
			if (editContent.indexOf('li') !== -1 && event.target.childNodes[0].firstChild !== Selector.selector.anchorNode.parentNode) return;

			arrowUp(event);
			return;
		} else if (event.key === 'ArrowDown') {
			let editContent = TextEditor.editorState.getContents();
			if (editContent.indexOf('li') !== -1 && event.target.childNodes[0].lastChild !== Selector.selector.anchorNode.parentNode) return;

			arrowDown(event);
			return;
		} else if (event.key === 'Enter') {
			// event.preventDefault();
			handleEnter();
			return;
		} else if (event.key === 'Backspace') {
			time = 5;
			let textContent = TextEditor.editorState.getText();

			if (textContent.length === 0) {
				event.preventDefault();

				if (EditManager.lisEditList.length > 1) {
					TextEditor.editorState.setContents(EditManager.lisEditList[focusIndex.current + 1].strHtml);
					EditManager.removeItem(focusIndex.current);
					arrowUp(event);
				}
			}
			return;
		}

		setTimeout(() => {
			Selector.nowCaretIndex = Selector.selector.anchorOffset;
			time = 5;
		}, 0);
	};
	const arrowUp = (event) => {
		handleBlur(event, TextEditor.editorState.getContents(), focusIndex.current);

		focusIndex.current = focusIndex.current - 1 >= 0 ? focusIndex.current - 1 : 0;
		focusNewDiv(event, focusIndex.current);

		if (event.target.childNodes[0].tagName === 'UL') {
			Selector.isUL = true;
		}
	};
	const arrowDown = (event) => {
		handleBlur(event, TextEditor.editorState.getContents(), focusIndex.current);

		focusIndex.current = focusIndex.current + 1 < EditManager.lisEditList.length ? focusIndex.current + 1 : focusIndex.current;
		focusNewDiv(event, focusIndex.current);
	};
	const focusNewDiv = (event, focusIndex) => {
		let newList = EditManager.lisEditList[focusIndex];
		EditManager.focusIndex = focusIndex;
		if (newList.type === 'image') {
			// event.stopPropagation();
			return;
		}

		newList.setSunEditor();

		TextEditor.showEditor();
		TextEditor.setSunEditorHTML(newList.strHtml);
	};

	useImperativeHandle(cRef, () => ({
		pushEnter: handleEnter,
	}));
	const handleEnter = (event) => {
		if (focusIndex.current === -1) focusIndex.current = EditManager.lisEditList.length - 1;

		let editContent = TextEditor.editorState.getContents();
		if (editContent.indexOf('li') !== -1 && editContent.indexOf('<br>') === -1) return;

		EditManager.add(focusIndex.current);
		setTimeout(() => {
			arrowDown(event);
		}, 10);
	};

	const handleBlur = (event, editContent, oldIndex) => {
		if (focusIndex.current === -1) return;

		let index = oldIndex ? oldIndex : focusIndex.current;

		TextEditor.isChanging = true;

		// EditManager.focusIndex = null;
		let lastList = EditManager.lisEditList[index];
		if (lastList.type === 'string') lastList.strHtml = editContent;
		lastList.asynToComponent();

		StepControl.addStep(EditManager.outputFile());

		TextEditor.isChanging = false;
	};

	const lightStyle = {
		
	}

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
			getSunEditorInstance={getSunEditorInstance}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={handleBlur}
			setContents={editContent}
			// onCopy={handleCopy}
			// onCut={handleCut}
			// onPaste={handlePaste}
			onMouseDown={(event) => {
				event.stopPropagation();
			}}
		></SunEditor>
	);
};

export default Editor;
