import React, { Component } from 'react';
import style from './index.module.scss';

// const { useEffect, useState } = React;

// let lastX, isLeftBar, isMouseDown;
// const Image = (props) => {
// 	const [imgWidth, setImgWidth] = useState(600);

// 	useEffect(() => {
// 		document.addEventListener('mousemove', (event) => {
// 			event.preventDefault();
// 			changeWidth(event);
// 		});
// 		window.addEventListener('mouseup', () => (isMouseDown = false));
// 	}, []);

// const handleMouseDown = (event, isLeft) => {
// 	console.log(event.target);
// 	lastX = event.clientX;
// 	isMouseDown = true;
// 	isLeftBar = isLeft;
// };
// const changeWidth = (event) => {
// 	if (isMouseDown) {
// 		let changeX = event.clientX - lastX;
// 		if (isLeftBar) changeX *= -1;
// 		setImgWidth((pre) => {
// 			if (pre < 150) return 150;
// 			return pre + changeX;
// 		});
// 		lastX = event.clientX;
// 	}
// };

// 	return (
// 		<div
// 			className={style.EditImage}
// 			style={{ width: imgWidth }}
// 			onDoubleClick={() => {
// 				props.openDrawBoard(true, props.file.base64);
// 			}}
// 		>
// 			<div
// 				className={style.dragBar}
// 				style={{ left: '12px', height: imgWidth < 350 ? imgWidth / 4 : {} }}
// 				onMouseDown={(event) => handleMouseDown(event, true)}
// 			></div>
// 			<img draggable={false} src={props.file.base64} className={style.Image} />
// 			<div
// 				className={style.dragBar}
// 				style={{ right: '12px', height: imgWidth < 350 ? imgWidth / 4 : {} }}
// 				onMouseDown={(event) => handleMouseDown(event, false)}
// 			></div>
// 		</div>
// 	);
// };

// export default Image;

export default class Image extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imgWidth: 600,
		};
		this.lastX = 0;
		this.isMouseDown = false;
		this.isLeftBar = false;

		this.changeWidth = this.changeWidth.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}
	componentDidMount() {
		document.addEventListener('mousemove', (event) => {
			event.preventDefault();
			this.changeWidth(event);
		});
		window.addEventListener('mouseup', () => (this.isMouseDown = false));
	}

	handleMouseDown(event, isLeft) {
		this.lastX = event.clientX;
		this.isMouseDown = true;
		this.isLeftBar = isLeft;
	}
	changeWidth(event) {
		if (this.isMouseDown) {
			let changeX = event.clientX - this.lastX;
			if (this.isLeftBar) changeX *= -1;
			this.setState({
				imgWidth: this.state.imgWidth < 150 ? 150 : this.state.imgWidth + changeX,
			});
			this.lastX = event.clientX;
		}
	}

	render() {
		return (
			<div
				className={style.EditImage}
				style={{ width: this.state.imgWidth }}
				onDoubleClick={(event) => {
					event.preventDefault();
					this.props.openDrawBoard(true, this.props.file.base64);
				}}
			>
				<div
					className={style.dragBar}
					style={{ left: '12px', height: this.state.imgWidth < 350 ? this.state.imgWidth / 4 : {} }}
					onMouseDown={(event) => this.handleMouseDown(event, true)}
				></div>
				<img draggable={false} src={this.props.file.base64} className={style.Image} />
				<div
					className={style.dragBar}
					style={{ right: '12px', height: this.state.imgWidth < 350 ? this.state.imgWidth / 4 : {} }}
					onMouseDown={(event) => this.handleMouseDown(event, false)}
				></div>
			</div>
		);
	}
}
