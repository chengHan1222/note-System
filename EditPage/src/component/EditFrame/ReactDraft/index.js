import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(),
		};

		this.onEditorStateChange = this.onEditorStateChange.bind(this);
	}

	onEditorStateChange(editorState) {
		this.setState({ editorState });
	}
	render() {
		const { editorState } = this.state;
		return (
			// style={{ border: '1px, solid, black', height: '600px' }}
			<>
				<div>
					<Editor
						initialEditorState={editorState}
						wrapperClassName="demo-wrapper"
						editorClassName="demo-editor"
						onEditorStateChange={this.onEditorStateChange}
					/>
				</div>
				<textarea style={{resize: 'both'}} disabled value={draftToHtml(convertToRaw(editorState.getCurrentContent()))} />
			</>
		);
	}
}
