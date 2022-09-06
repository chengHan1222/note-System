import React, { useRef } from "react";
import style from "./index.module.scss";

import ContentEditable from 'react-contenteditable';


class FileBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: {},
		}
		this.handleInput = this.handleInput.bind(this);
	}

	static getDerivedStateFromProps(props, state) {
		let status = {};
		if (props.isSelect === `${props.folderName}_fileBtn${props.id}`) {
			if (props.focusSpace === "FileBar") {
				if (props.isNaming === false) {
					status = {backgroundColor: "rgb(85, 94, 98)",
						border: "1px solid blue"};
				} else {
					status = {backgroundColor: "rgba(0, 0, 255, 0.3)",
						border: "1px solid rgba(85, 94, 98, 0.5)"};
				}
			} else {
				status = {backgroundColor: "rgb(85, 94, 98)",
					border: "1px solid rgba(85, 94, 98, 0.5)"};
			}
		}
		return { status: status };
	}

	handleInput(event) {
		if (this.props.isNaming) {
			this.props.setFileName(event.target.outerText);
		}
	}

	render() {
		return (
			<div id={`${this.props.folderName}_fileBtn${this.props.id}`}
				className={style.fileBtnStyle}
				style={this.state.status}
			>
				<img src={require("../../../../assets/tIcon.png")} className={style.fileBtnIcon} />
				<div className={style.fileBtnTitle}
					contentEditable={(this.props.isNaming) ? true : false}
					style={(this.props.isNaming) ?
						{ border: "1px solid  blue" } : {}}
					onInput={this.handleInput}
					onKeyDown={this.props.keyDown}
					dangerouslySetInnerHTML={{ __html: this.props.fileName }}
				></div>
			</div>
		)
	}
}

export default FileBtn;