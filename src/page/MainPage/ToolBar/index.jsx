import React from 'react';
import ReactFileReader from 'react-file-reader';

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
import TextEditor from '../../../tools/TextEditor'
import { StepControl } from '../../../tools/IconFunction';

const { useEffect, useState, useRef } = React;

const ToolBar = () => {
	const childRef = useRef();
	const [isDrawBoardShow, setDrawBoardShow] = useState(false);

	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			if (!classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'z') {
				this.updateEditList(StepControl.undo());
			}
			if (!classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'y') {
				this.updateEditList(StepControl.redo());
			}
		});
	}, []);

	const handleImageFiles = (file) => {
		if (EditManager.focusIndex === -1) {
			EditManager.focusIndex = EditManager.lisEditList.length - 1;
			TextEditor.setSunEditorHTML(EditManager.lisEditList[EditManager.focusIndex].strHtml)
		}

		childRef.current.pushEnter();
		let EditList = EditManager.lisEditList[EditManager.focusIndex + 1];
		EditList.strHtml = file;
		EditList.type = 'image'
	};

	const handleMenuClick = (event) => {
		if (event.key === '1') {
		}
	};

	const updateEditList = (List) => {
		EditManager.readFile(List);
	};

	const menu = (
		<Menu
			selectable
			onClick={handleMenuClick}
			items={[
				{
					key: '1',
					label: (
						<ReactFileReader fileTypes={['.jpg', '.png', '.jpeg', '.gif']} base64={true} multipleFiles={false} handleFiles={handleImageFiles}>
							<>照片上傳</>
						</ReactFileReader>
					),
				},
				{ key: '2', label: '立即照相' },
			]}
		/>
	);

	return (
		<div className={style.toolBar}>
			<div className={style.iconBar}>
				<FontAwesomeIcon
					icon={faRotateLeft}
					onClick={() => {
						updateEditList(StepControl.undo());
					}}
				/>
				<FontAwesomeIcon
					icon={faRotateRight}
					onClick={() => {
						updateEditList(StepControl.redo());
					}}
				/>
			</div>

			<SunEditor cRef={childRef} />

			<div className={style.iconBar}>
				<Dropdown overlay={menu} trigger={['click']}>
					<Space align="top" style={{ height: '34px', lineHeight: 0 }}>
						<FontAwesomeIcon icon={faImage} />
					</Space>
				</Dropdown>

				<FontAwesomeIcon icon={faImage} onClick={() => setDrawBoardShow(true)} />
				<DrawBoard background={require('../../../assets/302383.png')} isOpen={isDrawBoardShow} setDrawBoardShow={setDrawBoardShow} />
			</div>

			<RecogBtn />
		</div>
	);
};

export default ToolBar;
