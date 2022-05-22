import React, { Component } from 'react';
import './index.css';

export default class index extends Component {
	title;
	constructor(props) {
		super(props);
		// this.title = props.title;
		this.state = {
			title: props.title,
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (props.title !== state.title) {
			return {
				title: props.title,
			};
		}
		return null;
	}

	render() {
		return (
			<aside className="fileBar">
				<p>{this.state.title}</p>
				<div className="sideBar"></div>
			</aside>
		);
	}
}
