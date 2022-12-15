import React from 'react';
import { useNavigate } from 'react-router-dom';

import lightTheme from './light.module.scss';
import darkTheme from './dark.module.scss';

import Slick from './Slick';
import TopBar from './TopBar';

import Controller from '../../tools/Controller';
import UserData from '../../tools/UserData';

const { useEffect, useState } = React;

const Welcome = () => {
	const [introIndex, setIntroIndex] = useState(0);
	const [darkBtn, setDarkTheme] = useState(UserData.darkTheme);
	const navigation = useNavigate();
	let css = darkBtn ? darkTheme : lightTheme;

	useEffect(() => {
		checkToken();
	}, []);

	useEffect(() => {
		css = darkBtn ? darkTheme : lightTheme
		UserData.darkTheme = darkBtn;
	}, [darkBtn]);

	const changeIntroIndex = (input) => {
		setIntroIndex(input);
	};

	const checkToken = () => {
		Controller.checkToken()
			.then((response) => {
				if (response && response.status === 200) {
					let data = response.data;
					UserData.setData(data.name, JSON.parse(data.data), data.email, data.uid, data.img);
					navigation('/MainPage');
				}
			})
			.catch(() => navigation('/'));
	};

	return (
		<div className={css.mainblock}>
			<TopBar darkBtn={darkBtn} setDarkTheme={setDarkTheme} changeIntroIndex={changeIntroIndex}></TopBar>

			<Slick introIndex={introIndex} changeIntroIndex={changeIntroIndex}></Slick>
		</div>
	);
};

export default Welcome;
