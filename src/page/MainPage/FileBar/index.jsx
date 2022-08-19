import React, { Component } from 'react';
import style from './index.module.scss';



export default class index extends Component {
	fileName = "";
	isNaming = false;
	isMouseDown = false;
	isDivClose = false;
	prevPointX = [0, 0];

	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			width: 220,
			isSelect: "",
			files: [
				{fileName: "first",
				fileData: `List  0/*/List  1/*/List  2/*/List  3/*/List  4/*/List  5/*/List  6/*/List  7/*/<strong>123</strong>/*/`},
				{fileName: "second", 
				fileData: `List  0/*/List  1/*/List  2/*/List  3/*/List  4/*/List  5/*/List  6/*/List  7/*/<strong>123</strong>/*/`},
			]
		};
		this.setfileName = this.setfileName.bind(this);
		this.keyDown = this.keyDown.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.mouseMove = this.mouseMove.bind(this);
		this.mouseUp = this.mouseUp.bind(this);

		document.addEventListener('mousemove', this.mouseMove);
		document.addEventListener('mouseup', this.mouseUp);
		document.addEventListener('keydown', this.keyDown);
	}

	static getDerivedStateFromProps(props, state) {
		if (props.title !== state.title) {
			return {
				title: props.title,
			};
		}
		return null;
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
			if (!event.target.className.includes("fileBtn")) {
				if (this.isNaming === true) {
					if (!this.isFileNameEnable(this.fileName)) {
						alert("名稱不合法");
						return
					}
					this.isNaming = false;
					let files = this.state.files;
					files[0].fileName = this.fileName;
					this.setState({files: files})
				} else {
					this.setState({isSelect: ""});
					return;
				}
			}
			if (event.target.className.includes("fileBtnStyle")) {
				this.setState({isSelect: event.target.id});
			}
			else {
				this.setState({isSelect: event.target.parentNode.id});
			}
		} else if (event.detail === 2) {

		}
	}

	keyDown(event) {
		event.preventDefault();
		if (this.isNaming === true && event.key === "Enter") {
			if (!this.isFileNameEnable(this.fileName)) {
				alert("名稱不合法");
				return
			} else {
				this.isNaming = false;
				let files = this.state.files;
				files[0].fileName = this.fileName;
				this.setState({files: files})
			}
		}
	}

	isFileNameEnable(fileName) {
		let files = this.state.files;
		if (this.fileName === "") return false;
		for (let i=1; i<files.length; i++) {
			if (fileName === files[i].fileName) return false;
		}
		return true;
	}

	addfile() {
		let files = this.state.files;
		this.fileName = "";
		files.unshift({fileName: "", fileData: ""})
		this.setState({files: files,})
		setTimeout(() => {
			this.isNaming = true;
		}, 0)
	}

	deletefile() {
		let num = this.state.isSelect.split("fileBtn")[1]
		let files = this.state.files;
		files.splice(num, 1);
		this.setState({files: files});
	}

	setfileName(name) {
		this.fileName = name;
	}

	render() {
		return (
			<>
				<div style={{display: (this.isDivClose)? "none": "block"}}
					onClick={this.handleClick.bind(this)}
				>
					<aside className={style.fileBar} style={{ width: this.state.width }}>
						<div className={style.topBlock}>
							<p className={style.titleName}>{`${this.state.title}`}</p>
							
							<div className={style.iconBlock}>
								<img src={require('../../../assets/addFileIcon.png')} className={style.fileIcon} onClick={this.addfile.bind(this)}/>
								<img src={require('../../../assets/delFileIcon.png')} className={style.fileIcon} onClick={this.deletefile.bind(this)}/>
								<img src={require('../../../assets/refresh.png')} className={style.fileIcon}/>
							</div>
						</div>

						<hr className={style.splitLine}/>

						{ fileBtns(this.state.isSelect, this.state.files, this.setfileName) }
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
			</>
		);
	}
}


class FileBtn extends Component {
	constructor(props){
		super(props);
		this.state = {
			fileName: this.props.fileName,
			fileData: this.props.fileData,
		}
	}

	render() {
		return(
			<div 
				id={`fileBtn${this.props.id}`}
				className={style.fileBtnStyle}
				style={(this.props.isSelect === `fileBtn${this.props.id}`)? {backgroundColor: "rgb(85, 94, 98)"}: {}}
			>
				<img src={require("../../../assets/tIcon.png")} className={style.fileBtnIcon}/>
				<span className={style.fileBtnTitle}>{this.state.fileName}</span>
			</div>
		)
	}
}

const fileBtns = (isSelect, files, setfileName) => {

	const enterfileName = (event) => {
		setfileName(event.target.outerText);
	}

	return (
		files.map((item, index) => {
			let file = (item.fileName !== "" && !item.fileData !== "")?
			<FileBtn 
				key={`fileBtn${item.fileName}${index}`} 
				fileName={item.fileName} 
				fileData={item.fileData} 
				id={index}
				isSelect={isSelect}
			/>: <div 
				key={`fileBtn${index}`} 
				contentEditable={true} 
				className={style.fileBtn_editName} 
				onInput={enterfileName}
			></div>

			return file;
		})
	)
}

