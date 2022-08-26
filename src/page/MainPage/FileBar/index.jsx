import React, { Component } from 'react';
import style from './index.module.scss';
import FileBlock from "./FileBlock"
import FileRightClickBlock from './fileRightClickBlock';

export default class index extends Component {
	isNaming = false;
	isMouseDown = false;
	isDivClose = false;
	prevPointX = [0, 0];

	constructor(props) {
		super(props);
		this.state = {
			intX: 0,
			intY: 0,

			booRCBVisible: false,
			title: props.title,
			width: 220,
			isSelect: "",
			files: props.files,
		};

		this.addFile = this.rightClickBlockFunctions.addFile.bind(this);
		this.removeFile = this.rightClickBlockFunctions.removeFile.bind(this);
		this.rename = this.rightClickBlockFunctions.rename.bind(this);
		this.moveToFavorite = this.rightClickBlockFunctions.moveToFavorite.bind(this);
		this.removeFromFavorite = this.rightClickBlockFunctions.removeFromFavorite.bind(this);
		
		this.setfileName = this.setfileName.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.mouseMove = this.mouseMove.bind(this);
		this.mouseUp = this.mouseUp.bind(this);

		document.addEventListener('mousemove', this.mouseMove);
		document.addEventListener('mouseup', this.mouseUp);
	}

	static getDerivedStateFromProps(props, state) {
		if (props.title !== state.title) {
			return {
				title: props.title,
			};
		}
		return null;
	}

	componentDidUpdate() {
		if (this.props.focusSpace === "EditFrame") {
			if (this.isNaming === true) {
				if (this.fileName === "") {
					this.deletefile();
				} else if (this.isFileNameEnable()) {
					this.finishFileName();
				} else {
					alert("名稱不合法");
				}
			} else if (this.state.booRCBVisible === true){
				this.setState({booRCBVisible: false})
			}
		}
	}

	rightClickBlockFunctions = {
		rename: () => {

		}, 
		moveToFavorite: () => {

		},
		removeFromFavorite: () => {

		},
		addFile: () => {

		},
		removeFile: () => {

		}
	}

	mouseDown() {
		this.isMouseDown = true;
	}
	mouseMove(event) {
		if (this.isMouseDown) {
			event.preventDefault();
			if (this.state.width === 0) {
				if (this.prevPointX[0] === 0) this.prevPointX[0] = event.pageX;
				if (event.pageX > this.prevPointX[1]) this.prevPointX[1] = event.pageX;
				if (this.prevPointX[1] > this.prevPointX[0] + 10) {
					this.prevPointX = [0, 0];
					this.setState({ width: 200 });
				}
			} else if (event.pageX <= 120) {
				this.isDivClose = true;
				this.setState({ width: 0 });
			} else if (event.pageX >= 220) {
				this.isDivClose = false;
				this.setState({ width: event.pageX });
			}
		}
	}
	mouseUp() {
		this.isMouseDown = false;
		this.setState({ width: this.state.width });
	}

	handleClick(event) {
		event.preventDefault();
		if (event.detail === 1){
			let clickTarget = this.checkClickSpace(event.target);
			if (this.isNaming === true) {
				if (clickTarget!==this.state.isSelect) {
					if (this.fileName === "") {
						this.deletefile();
					} else if (this.isFileNameEnable()) {
						this.finishFileName();
					} else {
						alert("名稱不合法");
					}
				}
			} else {
				if (clickTarget !== "") {
					this.setState({isSelect: clickTarget, 
						booRCBVisible: false});
				} else {
					this.setState({booRCBVisible: false});
				}
			}
		} else if (event.detail === 2) {
			if (this.state.isSelect.includes("_fileBtn")) {
				this.props.funSetFocusFile(this.state.isSelect);
			}
		}
	}

	checkClickSpace(target) {
		let result = "";
		if (target.id.includes("fileBtn")) {
			result = target.id;
		} else if (target.parentNode.id.includes("fileBtn")) {
			result = target.parentNode.id;
		}
		return result;
	}

	isFileNameEnable() {
		let files = this.state.files[0].files;
		for (let i=1; i<files.length; i++) {
			if (this.fileName === files[i].fileName) return false;
		}
		files = this.state.files[1].files;
		for (let i=1; i<files.length; i++) {
			if (this.fileName === files[i].fileName) return false;
		}
		return true;
	}

	finishFileName() {
		let files = this.state.files;
		let select = this.state.isSelect;
		let folder = select.split("_")[0];
		let num = select.split("fileBtn")[1];
		if (folder === "favorite") {
			files[0].files[num].fileName = this.fileName;
			files[0].files[num].isNaming = false;
		} else if (folder === "normal") {
			files[1].files[num].fileName = this.fileName;
			files[1].files[num].isNaming = false;
		}
		this.setState({files: files})
		this.isNaming = false;
	}

	handleRightClick(event) {
		event.preventDefault();
		let clickTarget = this.checkClickSpace(event.target);
		if (clickTarget !== "") {
			this.setState({
				intX: event.pageX,
				intY: event.pageY,
				isSelect: clickTarget,
				booRCBVisible: true,
			})
		} else {
			this.setState({booRCBVisible: false});
		}
	}

	keyDown(event) {
		event.preventDefault();
		if (this.isNaming === true && event.key === "Enter") {
			if (this.isFileNameEnable()) {
				this.finishFileName();
			} else {
				alert("名稱不合法");
			}
		}
	}

	setfileName(name) {
		this.fileName = name;
	}

	addfile() {
		if (this.isNaming === false) {
			let files = this.state.files;
			files[1].files.unshift({filesName: "", filesDate: "", isNaming: true})
			this.setState({files: files, isSelect: "normal_fileBtn0"}, 
				() => {
					this.isNaming = true;
					this.fileName = "";
				}
			)
		}
	}

	deletefile() {
		let folder = this.state.isSelect.split("_")[0]
		let num = this.state.isSelect.split("fileBtn")[1]
		let files = this.state.files;
		if (folder === "favorite") {
			files[0].files.splice(num, 1);
		} else if (folder === "normal") {
			files[1].files.splice(num, 1);
		}
		this.setState({files: files});
		this.isNaming = false;
	}

	render() {
		return (
			<>
				<div style={{display: (this.isDivClose)? "none": "block"}}
					onClick={this.handleClick.bind(this)}
					onContextMenu={this.handleRightClick.bind(this)}
				>
					<aside className={style.fileBar} 
						style={{ width: this.state.width }}
					>
						<div className={style.topBlock}>
							<p className={style.titleName}>{`${this.state.title}`}</p>
							
							<div className={style.iconBlock}>
								<img src={require('../../../assets/addFileIcon.png')} className={style.fileIcon} onClick={this.addfile.bind(this)}/>
								<img src={require('../../../assets/delFileIcon.png')} className={style.fileIcon} onClick={this.deletefile.bind(this)}/>
								<img src={require('../../../assets/refresh.png')} className={style.fileIcon}/>
							</div>
						</div>

						<hr className={style.splitLine}/>

						{this.state.files.map((item, index) => {
							return (
								<FileBlock key={"FileBlock_"+item.folder}
									name={item.folder}
									isSelect={this.state.isSelect}
									files={item.files}
									isNaming={item.isNaming}
									focusSpace={this.props.focusSpace}
									setfileName={this.setfileName}
									keyDown={this.keyDown.bind(this)}
								/>
							)
						})}
					</aside>
				</div>

				<div
					className={style.sideBar}
					style={{
						marginLeft: this.state.width === 0 ? 0 : '-3px',
						backgroundColor: this.isMouseDown ? 'rgb(93, 190, 255)' : 'transparent',
					}}
					onMouseDown={this.mouseDown}
				></div>

				<FileRightClickBlock 
					x={this.state.intX} 
					y={this.state.intY} 
					show={this.state.booRCBVisible}
					functions={this.rightClickBlockFunctions}
				/>
			</>
		);
	}
}

