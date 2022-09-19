import React from 'react';
import style from './index.module.scss';
import FileBtn from '../FileBtn';

class FileBlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			strBlockName: props.name,
			showContent: false,
			status: {},
		};
	}

	static getDerivedStateFromProps(props, state) {
		let status = {};
		if (props.isSelect === `fileBtn_${state.strBlockName}`) {
			if (props.focusSpace === 'FileBar') {
				if (props.isNaming === false) {
					status = { backgroundColor: 'rgb(85, 94, 98)', border: '1px solid blue' };
				} else {
					status = { backgroundColor: 'rgba(0, 0, 255, 0.3)', border: '1px solid rgba(85, 94, 98, 0.5)' };
				}
			} else {
				status = { backgroundColor: 'rgb(85, 94, 98)', border: '1px solid rgba(85, 94, 98, 0.5)' };
			}
		} else if (props.isSelect.includes(state.strBlockName)) {
			return { showContent: true, status: {} };
		}
		return { status: status };
	}

	handleClick() {
		if (this.props.isNaming === false) {
			if (this.state.showContent === false) {
				this.setState({ showContent: true });
			} else {
				this.setState({ showContent: false });
			}
		}
	}

	handleChange(event) {
		if (this.props.isNaming) {
			this.props.setFileName(event.currentTarget.textContent);
		}
	}

	render() {
		return (
			<>
				<div
					id={`fileBtn_${this.state.strBlockName}`}
					className={style.fileBlock}
					onClick={this.handleClick.bind(this)}
					style={this.state.status}
				>
					<img
						className={style.fileBlockIndicate}
						src={require(this.state.showContent
							? '../../../../assets/fileIndicateDown.png'
							: '../../../../assets/fileIndicateRight.png')}
					/>
					<div
						className={style.fileBlockTitle}
						contentEditable={this.props.isNaming ? true : false}
						style={this.props.isNaming ? { border: '1px solid blue' } : {}}
						onInput={this.handleChange.bind(this)}
						onKeyDown={this.props.keyDown}
						dangerouslySetInnerHTML={{ __html: this.state.strBlockName }}
					></div>
				</div>

				<div style={{ display: this.state.showContent ? '' : 'none' }}>
					{this.props.files.map((item, index) => {
						return (
							<FileBtn
								id={index}
								key={`fileBtn${item.fileName}${index}`}
								folderName={this.state.strBlockName}
								fileName={item.fileName}
								isNaming={item.isNaming}
								isSelect={this.props.isSelect}
								focusSpace={this.props.focusSpace}
								setFileName={this.props.setFileName}
								keyDown={this.props.keyDown}
							/>
						);
					})}
				</div>
			</>
		);
	}
}
export default FileBlock;
