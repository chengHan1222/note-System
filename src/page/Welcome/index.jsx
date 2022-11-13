import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './index.module.scss';
import Slick from './Slick';
import TopBar from './TopBar';

import Controller from '../../tools/Controller';
import UserData from '../../tools/UserData';

export default function (props) {
	const navigation = useNavigate();

	return <Index {...props} navigation={navigation} />;
}

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			introIndex: 0,
		};

		this.checkToken();

		this.changeIntroIndex = this.changeIntroIndex.bind(this);
	}

	checkToken() {
		Controller.checkToken().then((response) => {
			if (response && response.status === 200) {
				UserData.setData(response.data.name, JSON.parse(response.data.data));
				console.log(UserData.getData())
				this.props.navigation('/MainPage');
			}
		});
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
