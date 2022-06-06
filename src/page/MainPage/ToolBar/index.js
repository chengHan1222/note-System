import React, { Component } from 'react';
import { EditorState, ContentState, convertFromRaw, convertFromHTML, convertToRaw, RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import style from './index.module.scss';

// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';

import TextEditor from '../../../tools/TextEditor';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createWithContent(
				ContentState.createFromBlockArray(convertFromHTML('<p>My initial content.</p>'))
			),
		};

		TextEditor.editorState = this.state.editorState;
	}

	handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);

		if (newState) {
			this.onChange(newState);
			return 'handled';
		}
		return 'not-handled';
	}

	onChange(internalEditorState) {
		TextEditor.editorState = internalEditorState;
		this.setState({ editorState: internalEditorState });
	}
	handleChangeTextArea(event) {
		this.setState({ editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(event.target.value))) });
	}

	// _onBoldClick() {
	// 	this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
	// }

	clickButton() {
		console.log();
	}

	render() {
		const { editorState } = this.state;
		return (
			<div className={style.toolBar}>
				<Editor
					editorState={editorState}
					wrapperClassName={style.text_wrapper}
					toolbarClassName={style.text_toolbar}
					editorClassName={`${style.text_editor_id} text_editor_id`}
					handleKeyCommand={this.handleKeyCommand.bind(this)}
					onEditorStateChange={this.onChange.bind(this)}
				/>
			</div>
		);
	}
}
