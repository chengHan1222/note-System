import React from 'react';
import ReactFileReader from 'react-file-reader';

import style from './light.module.scss';
import darkmode from './dark.module.scss';

import { Divider, Dropdown, Modal, Popover, Space } from 'antd';
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
	const canvasRef = useRef();
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

	const drawNewPicture = (color) => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		canvas.width = 600;
		canvas.height = 400;
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 600, 400);

		handleImageFiles({ base64: canvas.toDataURL() });

		ctx.clearRect(0, 0, 600, 400);
	};

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
				EditList.strHtml = response.imgId;
				UserData.setImgs(response.data.img);

				EditManager.asynToComponent();
				props.saveFile();
			});
		} else {
			EditList.imgSrc = file.base64;

			Controller.uploadImg(UserData.userId, Controller.dataURItoBlob(file.base64)).then((response) => {
				UserData.setImgs(response.data.img);
				EditList.strHtml = response.imgId;

				EditManager.asynToComponent();
				props.saveFile();
			});
		}
	};

	const handleRecordFiles = (file) => {
		// if (file.fileList[0].type === 'audio/mpeg') {
		// 	file.fileList[0].type = 'audio/wav';
		// }

		let voiceFile = new FormData();
		voiceFile.append('voice', file.fileList[0]);
		props.openVoiceBar(true, file.fileList[0].name);

		Controller.voiceToWord(voiceFile).then((response) => {
			props.openVoiceBar(true, file.fileList[0].name, response.data.text, response.data.keyword);
		});
	};

	const updateEditList = (List) => {
		EditManager.readFile(List);
	};
	const imageBackground = <div>123</div>;

	const pictureItem = [
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
		{
			label: (
				<div onClick={() => drawNewPicture('red')}>123</div>
				// onClick={() => drawNewPicture('red')}
				// <Popover placement="bottom" content={imageBackground} title="Title">
				// 	新增畫布
				// </Popover>
			),
			key: '3',
		},
	];

	const recordItem = [
		{
			label: (
				<ReactFileReader fileTypes={['.wav', '.mp3']} base64={true} multipleFiles={false} handleFiles={handleRecordFiles}>
					<>音檔上傳</>
				</ReactFileReader>
			),
			key: '1',
		},
		{
			label: <div onClick={() => props.openVoiceBar(true, '即時錄音')}>即時錄音</div>,
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

			<Divider type="vertical" style={{ height: '30px', borderWidth: '4px', borderColor: 'rgb(0 0 0 / 13%)' }} />

			<SunEditor cRef={childRef} style={props.style} saveFile={props.saveFile} />

			<div className={css.iconBar}>
				<canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

				<Dropdown menu={{ items: pictureItem }} trigger={['click']}>
					{/* <img src={require('../../../assets/OCR_light.png')}/> */}
					<FontAwesomeIcon icon={faImage} />
				</Dropdown>

				<Dropdown menu={{ items: recordItem }} placement="bottomLeft" trigger={['click']}>
					<img src={require('../../../assets/record_light.gif')} />
				</Dropdown>

				<Modal width="80vw" centered footer={null} closable={false} destroyOnClose open={isCamaraOpen} onCancel={() => setCamaraOpen(false)}>
					<OpenCamera close={() => setCamaraOpen(false)} handleImageFiles={handleImageFiles} />
				</Modal>
			</div>

			{/* <RecogBtn /> */}
		</div>
	);
};

export default ToolBar;
