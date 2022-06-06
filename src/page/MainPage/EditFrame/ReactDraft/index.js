import React, { Component } from 'react';
import { EditorState, ContentState, convertFromRaw, convertFromHTML, convertToRaw, RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

import './index.css';
import '../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createWithContent(
				ContentState.createFromBlockArray(convertFromHTML('<p>My initial content.</p>'))
			),
		};
	}

	handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);

		if (newState) {
			this.onChange(newState);
			return 'handled';
		}
		return 'not-handled';
	}

	// onEditorStateChange(editorState) {
	// 	this.setState({ editorState });
	// }

	onChange(editorState) {
		this.setState({ editorState });
	}

	_onBoldClick() {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
	}

	render() {
		const { editorState } = this.state;
		return (
			<>
				<button onClick={this._onBoldClick.bind(this)}>Bold</button>
				<Editor
					editorState={editorState}
					wrapperClassName="text_wrapper"
					toolbarClassName="text_toolbar"
					editorClassName="text_editor"
					handleKeyCommand={this.handleKeyCommand.bind(this)}
					onEditorStateChange={this.onChange.bind(this)}
				/>
				<br />
				<br />
				{/* <Editor
					editorState={editorState}
					wrapperClassName="demo-wrapper"
					editorClassName="demo-editor"
					onEditorStateChange={this.onEditorStateChange.bind(this)}
				/> */}

				<textarea
					style={{ resize: 'both' }}
					disabled
					value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
				/>
				{/* <button
					onClick={() => {
						console.log(editorState.getCurrentContent());
					}}
				>
					get HTML
				</button> */}
			</>
		);
	}
}
