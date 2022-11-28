import React from 'react';
import ReactFileReader from 'react-file-reader';

import style from './light.module.scss';
import darkmode from './dark.module.scss';

import { Dropdown, Modal, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';

import OpenCamera from './OpenCamera';
import RecogBtn from './RecogBtn';
import SunEditor from './SunEditor';

import EditManager from '../../../tools/EditFrame';
import classDrawBoard from '../../../tools/DrawBoard';
import TextEditor from '../../../tools/TextEditor';
import StepControl from '../../../tools/StepControl';

import Controller from '../../../tools/Controller';
import UserData from '../../../tools/UserData';

const { useEffect, useState, useRef } = React;

const ToolBar = (props) => {
	const childRef = useRef();
	const [isCamaraOpen, setCamaraOpen] = useState(false);
	const css = props.style ? darkmode : style;

	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			if (!classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'z') {
				updateEditList(StepControl.undo());
			}
			if (!classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'y') {
				updateEditList(StepControl.redo());
			}
		});
	}, []);

	const handleImageFiles = (file) => {
		if (EditManager.focusIndex === -1) {
			EditManager.focusIndex = EditManager.lisEditList.length - 1;
			TextEditor.setSunEditorHTML(EditManager.lisEditList[EditManager.focusIndex].strHtml);
		}
		childRef.current.pushEnter();

		let EditList = EditManager.lisEditList[EditManager.focusIndex + 1];
		EditList.type = 'image';

		if (file.fileList) {
			EditList.imgSrc = file.base64;

			Controller.uploadImg(UserData.userId, file.fileList[0]).then((response) => {
				UserData.setImgs(response.data.img);
				EditList.strHtml = response.data.imgId;

				console.log(response);
			});
		} else {
			EditList.imgSrc = file;

			Controller.uploadImg(UserData.userId, Controller.dataURItoBlob(file)).then((response) => {
				UserData.setImgs(response.data.img);
				EditList.strHtml = response.data.imgId;

				console.log(response);
			});
		}
	};

	const updateEditList = (List) => {
		EditManager.readFile(List);
	};

	const items = [
		{
			label: (
				<ReactFileReader fileTypes={['.jpg', '.png', '.jpeg', '.gif']} base64={true} multipleFiles={false} handleFiles={handleImageFiles}>
					<>照片上傳</>
				</ReactFileReader>
			),
			key: '1',
		},
		{
			label: <div onClick={() => setCamaraOpen(true)}>立即照相</div>,
			key: '2',
		},
	];

	return (
		<div className={css.toolBar}>
			<div className={css.iconBar}>
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

			<SunEditor cRef={childRef}  saveFile={props.saveFile}/>

			<div className={css.iconBar}>
				<Dropdown menu={{ items }} trigger={['click']}>
					<Space align="top" style={{ height: '34px', lineHeight: 0 }}>
						<FontAwesomeIcon icon={faImage} />
					</Space>
				</Dropdown>

				<Modal width="80vw" centered footer={null} closable={false} destroyOnClose open={isCamaraOpen} onCancel={() => setCamaraOpen(false)}>
					<OpenCamera close={() => setCamaraOpen(false)} handleImageFiles={handleImageFiles} />
				</Modal>
			</div>

			<RecogBtn />
		</div>
	);
};

export default ToolBar;
