import React, { Component } from 'react';
import style from './index.module.scss'

import ToolBar from './ToolBar';
import FileBar from './FileBar';
import EditFrame from './EditFrame';


export default class index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: 'title........'
		}
	}

	change() {
		this.setState({title: "banana"});
	}

	render() {
		return (
			<div className={style.mainPage}>
				<FileBar title={this.state.title}></FileBar>

				<div className={style.editFrame}>
					<ToolBar></ToolBar>
					<EditFrame></EditFrame>
				</div>
			</div>
		);
	}
}
