import React, { Component } from 'react';

import Slick from './Slick';
import TopBar from './TopBar';

export default class index extends Component {
	render() {
		return (
			<>
				<TopBar></TopBar>

				<Slick></Slick>
			</>
		);
	}
}
