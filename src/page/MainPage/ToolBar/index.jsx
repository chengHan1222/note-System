import React, { Component } from 'react';
import style from './index.module.scss';

import RecogBtn from './RecogBtn';
import SunEditor from './SunEditor';

import { StepControl } from '../../../tools/IconFunction';
import EditManager from '../../../tools/EditFrame';

export default class sunEditor extends Component {
	constructor(props) {
		super(props);

		this.updateEditList = this.updateEditList.bind(this);
	}

	updateEditList(List) {
		EditManager.lisEditList = [...List];
		EditManager.asynToComponent();
	}

	render() {
		return (
			<>
				<div className={style.toolBar}>
					<div className={style.iconBar}>
						<i
							className="fa-solid fa-rotate-left"
							onClick={() => {
								this.updateEditList(StepControl.undo());
							}}
						></i>
						<i
							className="fa-solid fa-rotate-right"
							onClick={() => {
								this.updateEditList(StepControl.redo());
							}}
						></i>
					</div>

					<SunEditor />

					<RecogBtn />
				</div>
			</>
		);
	}
}
