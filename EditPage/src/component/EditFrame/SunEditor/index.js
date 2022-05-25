import React, { Component } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';


export default class index extends Component {
    constructor(props) {
        super(props);
        this.editor = React.createRef();
    }

    getSunEditorInstance(sunEditor) {
        this.editor.current = sunEditor;
    };

	render() {
		return (
			<div>
				<br />
				<SunEditor getSunEditorInstance={this.getSunEditorInstance.bind(this)}/>
				<br />
			</div>
		);
	}
}
