import React, { Component } from 'react';
import style from './index.module.scss';

import VideoBtn from './VideoBtn';
import SunEditor from './SunEditor';

import EditManager from '../../../tools/EditFrame';
import { Selector } from '../../../tools/TextEditor';

export default class sunEditor extends Component {
	constructor(props) {
		super(props);

		this.getWordChange = this.getWordChange.bind(this);
	}

	getWordChange(change) {
		let rangeAt = Selector.getRan();
		switch(change) {
			case 'B':
				EditManager.focusList.insertTag('<strong>', rangeAt.startOffset, rangeAt.endOffset);
				break;
			case 'U':
				EditManager.focusList.insertTag('<u>', rangeAt.startOffset, rangeAt.endOffset);
				break;
		}
		
	}

	render() {
		return (
			<>
				<div className={style.buttonList}>
					<input type="button" value="B" onClick={() => {this.getWordChange('B')}}/>
					<input type="button" value="U" onClick={() => {this.getWordChange('U')}}/>
				</div>
				<div className={style.toolBar}>
					<SunEditor />

					<VideoBtn />
				</div>
			</>
		);
	}
}
