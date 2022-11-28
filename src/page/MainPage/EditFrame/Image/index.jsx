import React, { Component } from 'react';
import style from './index.module.scss';

export default class Image extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// barHeight: 90,
			imgWidth: 600,
		};

		this.lastX = 0;
		this.isMouseDown = false;
		this.isLeftBar = false;

		this.changeWidth = this.changeWidth.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}
	componentDidMount() {
		// console.log(this.imgElement);
		// const height = this.imgElement.offsetHeight;
		// console.log(height);
		// this.setState({ height: height });

		document.addEventListener('mousemove', (event) => {
			// event.preventDefault();
			this.changeWidth(event);
			event.stopPropagation();
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
					this.props.openDrawBoard(true, this.props.src);
				}}
			>
				<div
					className={style.dragBar}
					style={{ left: '12px', height: this.state.height > 90 ? '90px' : {} }}
					onMouseDown={(event) => this.handleMouseDown(event, true)}
				></div>
				<img
					// ref={(imgElement) => {
					// 	this.imgElement = imgElement;
					// }}
					draggable={false}
					src={this.props.src}
					className={style.Image}
				/>
				<div className={style.dragBar} style={{ right: '12px' }} onMouseDown={(event) => this.handleMouseDown(event, false)}></div>
			</div>
		);
	}
}
