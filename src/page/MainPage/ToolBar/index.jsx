import React, { Component } from 'react';
import style from './index.module.scss';

import RecogBtn from './RecogBtn';
import SunEditor from './SunEditor';

export default class sunEditor extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				<div className={style.toolBar}>
					<div className={style.iconBar}>
						<i className="fa-solid fa-rotate-left"></i>
						<i className="fa-solid fa-rotate-right"></i>
					</div>

					<SunEditor />

					<RecogBtn />
				</div>
			</>
		);
	}
}
