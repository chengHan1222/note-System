import React from 'react';
import ReactFileReader from 'react-file-reader';

import style from './index.module.scss';

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
import { StepControl } from '../../../tools/IconFunction';

import Controller from '../../../tools/Controller';
import UserData from '../../../tools/UserData';

const { useEffect, useState, useRef } = React;

const ToolBar = () => {
	const childRef = useRef();
	const [isCamaraOpen, setCamaraOpen] = useState(false);

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
		EditList.strHtml = file;
		EditList.type = 'image';

		if (file.fileList) {
			Controller.uploadImg(UserData.userId, file.fileList[0]).then(
			  (response) => {
				console.log(response);
			  }
			);
		  } else {
			Controller.uploadImg(UserData.userId, dataURItoBlob(file));
		  }
	};

	const dataURItoBlob = (dataURI) => {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		var byteString = window.atob(dataURI.split(",")[1]);

		// separate out the mime component
		var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);

		// create a view into the buffer
		var ia = new Uint8Array(ab);

		// set the bytes of the buffer to the correct values
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		var blob = new Blob([ab], { type: mimeString });
		return blob;
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
		}, // 菜单项务必填写 key
		{ label: <div onClick={() => setCamaraOpen(true)}>立即照相</div>, key: '2' },
	];

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
