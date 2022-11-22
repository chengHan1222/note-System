import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './index.module.scss';
import Slick from './Slick';
import TopBar from './TopBar';

import Controller from '../../tools/Controller';
import UserData from '../../tools/UserData';
import Loading from '../Loading';

const Welcome = (props) => {
	const navigation = useNavigate();

	return <Index {...props} navigation={navigation} />;
};

export default Welcome;

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
				UserData.setData(response.data.name, JSON.parse(response.data.data), response.data.email);
				this.props.navigation('/MainPage');
			}
		});
	}

	changeIntroIndex(input) {
		this.setState({ introIndex: input });
	}

	render() {
		return document.cookie.indexOf('token') !== -1 ? (
			<>
				<Loading /> {this.checkToken()}{' '}
			</>
		) : (
			<div className={style.mainblock}>
				<TopBar changeIntroIndex={this.changeIntroIndex}></TopBar>

				<Slick introIndex={this.state.introIndex} changeIntroIndex={this.changeIntroIndex}></Slick>
			</div>
		);
	}
}
