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
					<SunEditor />

					<RecogBtn />
				</div>
			</>
		);
	}
}
