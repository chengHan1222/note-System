import React, { Component } from 'react';
import style from './index.module.scss';
import Slick from './Slick';
import TopBar from './TopBar';

export default class index extends Component {

	render() {
		return (
			<div className={style.mainblock}>
				<TopBar></TopBar>

				<Slick></Slick>
			</div>
		);
	}
}
