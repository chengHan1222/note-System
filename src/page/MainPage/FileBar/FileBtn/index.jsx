import React, { useRef } from 'react';
import style from './index.module.scss';

class FileBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fileName: props.fileName,
			isSelect: props.isSelect,
			isNaming: props.isNaming,
			setfileName: props.setfileName,
			status: {},
		};
		this.handleInput = this.handleInput.bind(this);
	}

	static getDerivedStateFromProps(props, state) {
		let status = {};
		if (props.isSelect === `${props.folderName}_fileBtn${props.id}`) {
			if (props.focusSpace === 'FileBar') {
				if (props.isNaming === false) {
					status = { backgroundColor: 'rgba(0, 0, 255, 0.3)', border: '1px solid blue' };
				} else {
					status = { backgroundColor: 'rgb(85, 94, 98)', border: '1px solid rgba(85, 94, 98, 0.5)' };
				}
			} else {
				status = { backgroundColor: 'rgb(85, 94, 98)', border: '1px solid rgba(85, 94, 98, 0.5)' };
			}
		} else if (props.isNaming) {
		}
		return { status: status };
	}

	handleInput(event) {
		console.log(event);
		if (this.state.isNaming) {
			this.props.setfileName(event.target.outerText);
		}
	}

	render() {
		return (
			<div
				id={`${this.props.folderName}_fileBtn${this.props.id}`}
				className={style.fileBtnStyle}
				style={this.state.status}
			>
				<img src={require('../../../../assets/tIcon.png')} className={style.fileBtnIcon} />
				<div
					className={style.fileBtnTitle}
					contentEditable={this.state.isNaming ? true : false}
					style={this.state.isNaming ? { border: '1px solid  blue' } : {}}
					onInput={this.handleInput}
					onKeyDown={this.props.keyDown}
				>
					{this.state.fileName}
				</div>
			</div>
		);
	}
}

// const fileBtn = (index, folderName, fileName, isNaming, isSelect, focusSpace, setfileName) => {
// 	const enterfileName = (event) => {
// 		setfileName(event.target.outerText)
// 	}

// 	return (
// 		(isNaming === false)?
// 		<FileBtn key={`fileBtn${fileName}${index}`}
// 			folderName={folderName}
// 			fileName={fileName}
// 			isNaming={isNaming}
// 			isSelect={isSelect}
// 			focusSpace={focusSpace}
// 		/>:
// 		<div key={`fileBtn${index}`}
// 			id={"normal_fileBtn0"}
// 			contentEditable={true}
// 			className={style.fileBtnTitle}
// 			onInput={enterfileName}
// 		></div>
// 	)
// }

export default FileBtn;
