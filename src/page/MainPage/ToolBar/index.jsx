import React, { Component } from 'react';
import style from './index.module.scss';
import { Dropdown, Menu, Space } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';

import DrawBoard from './DrawBoard';
import RecogBtn from './RecogBtn';
import SunEditor from './SunEditor';

import EditManager from '../../../tools/EditFrame';
import classDrawBoard from '../../../tools/DrawBoard';
import { StepControl } from '../../../tools/IconFunction';

export default class sunEditor extends Component {
	constructor(props) {
		super(props);

		this.menu = (
			<Menu
				selectable
				items={[
					{ key: '1', label: '上傳圖片' },
					{ key: '2', label: '立即照相' },
				]}
			/>
		);
		this.updateEditList = this.updateEditList.bind(this);
		this.state = {
			isDrawBoardShow: false,
		};

		this.setDrawBoardShow = this.setDrawBoardShow.bind(this);

		document.addEventListener('keydown', (event) => {
			if (!classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'z') {
				this.updateEditList(StepControl.undo());
			}
			if (!classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'y') {
				this.updateEditList(StepControl.redo());
			}
		});
	}

	setDrawBoardShow(isShow) {
		this.setState({ isDrawBoardShow: isShow });
	}

	updateEditList(List) {
		EditManager.readFile(List);
	}

	render() {
		return (
			<div className={style.toolBar}>
				<div className={style.iconBar}>
					<FontAwesomeIcon
						icon={faRotateLeft}
						onClick={() => {
							this.updateEditList(StepControl.undo());
						}}
					/>
					<FontAwesomeIcon
						icon={faRotateRight}
						onClick={() => {
							this.updateEditList(StepControl.redo());
						}}
					/>
				</div>

				<SunEditor />

				<div className={style.iconBar}>
					<Dropdown overlay={this.menu} trigger={['click']}>
						<Space align="top" style={{ height: '34px', lineHeight: 0 }}>
							<FontAwesomeIcon icon={faImage} />
						</Space>
					</Dropdown>
					<FontAwesomeIcon icon={faImage} onClick={() => this.setDrawBoardShow(true)} />
					<DrawBoard
						background={require('../../../assets/302383.png')}
						isOpen={this.state.isDrawBoardShow}
						setDrawBoardShow={this.setDrawBoardShow}
					/>
				</div>

				<RecogBtn />
			</div>
		);
	}
}
