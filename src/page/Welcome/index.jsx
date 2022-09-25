import React, { Component } from 'react';
import style from './index.module.scss';
import Slick from './Slick';
import TopBar from './TopBar';

export default class index extends Component {

	constructor(props) {
		super(props);
		this.state = {
			introIndex: 0,
		}

		this.changeIntroIndex = this.changeIntroIndex.bind(this);
	}

	changeIntroIndex(input) {
		this.setState({ introIndex: input });
	}

	render() {
		return (
			<div className={style.mainblock}>
				<TopBar changeIntroIndex={this.changeIntroIndex}></TopBar>

				<Slick introIndex={this.state.introIndex} changeIntroIndex={this.changeIntroIndex}></Slick>
			</div>
		);
	}
}
