import React, { Component } from 'react';
import style from './index.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear } from '@fortawesome/free-regular-svg-icons';

import TopBar from '../Welcome/TopBar';

export default class index extends Component {
	render() {
		return (
			<>
				<TopBar />
				<div className={style.notFound}>
					<FontAwesomeIcon className={style.icon} icon={faFaceSadTear} /> Oh no! not found
				</div>
			</>
		);
	}
}
