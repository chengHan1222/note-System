import React from 'react';
import { useNavigate } from 'react-router-dom';

import style from './light.module.scss';
import darkmode from './dark.module.scss';

import Slick from './Slick';
import TopBar from './TopBar';

import Controller from '../../tools/Controller';
import UserData from '../../tools/UserData';

const { useEffect, useRef, useState } = React;

const Welcome = () => {
	const [introIndex, setIntroIndex] = useState(0);
	const [darkBtn, setDarkTheme] = useState(UserData.darkTheme);
	const navigation = useNavigate();
	const css = useRef(darkBtn ? darkmode : style);

	useEffect(() => {
		checkToken();
	});

	useEffect(() => {
		css.current = darkBtn ? darkmode : style;
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
		<div className={css.current.mainblock}>
			<TopBar style={css} setDarkTheme={setDarkTheme} darkBtn={darkBtn} changeIntroIndex={changeIntroIndex}></TopBar>

			<Slick style={css} introIndex={introIndex} changeIntroIndex={changeIntroIndex}></Slick>
		</div>
	);
};

export default Welcome;
