import React, { Component } from 'react';
import './index.css';

export default class index extends Component {
	title;
	isMouseDown = false;
	isDivClose = false;
	prevPointX = [0, 0];

	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			width: 220,
		};
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
			} else if (event.pageX <= 100) {
				this.isDivClose = true;
				this.setState({ width: 0 });
			} else if (event.pageX >= 200) {
				this.setState({ width: event.pageX });
			}
		}
	}
	mouseUp() {
		this.isMouseDown = false;
	}

	render() {
		return (
			<>
				<aside className="fileBar" style={{ width: this.state.width }}>
					<p>{this.state.title}</p>
				</aside>
				<div className="sideBar" onMouseDown={this.mouseDown}></div>
			</>
		);
	}
}
