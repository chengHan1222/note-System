import React from 'react';
import ReactFileReader from 'react-file-reader';

import style from './light.module.scss';
import darkmode from './dark.module.scss';

import { Button, Divider, Dropdown, Modal, Popover } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';

import OpenCamera from './OpenCamera';
import SunEditor from './SunEditor';
import styled from 'styled-components';

import EditManager from '../../../tools/EditFrame';
import classDrawBoard from '../../../tools/DrawBoard';
import TextEditor from '../../../tools/TextEditor';
import StepControl from '../../../tools/StepControl';
import Controller from '../../../tools/Controller';
import UserData from '../../../tools/UserData';

const CircleBtn = styled.div`
	width: 200px;
	display: flex;
	flex-wrap: wrap;

	.colorSpan,
	.colorSelector {
		width: 30px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 5px;
		border-radius: 50%;
		box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.7);
		color: white;
		font-size: 25px;
		cursor: pointer;
	}

	.comfirmDiv {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 10px;
	}
`;

const Upload = styled.div`
	margin-right: 15px;
	svg {
		width: 34px;
		height: 34px;
	}
`;

const { useEffect, useState, useRef } = React;

const PDFJS = window.pdfjsLib;

const ToolBar = (props) => {
	const colorCircleBtn = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', '#DABEA7', 'black', 'white'];
	const imagesList = [];

	const childRef = useRef();
	const canvasRef = useRef();
	const colorInput = useRef();
	const pdfUploadRef = useRef();
	const [isCamaraOpen, setCamaraOpen] = useState(false);
	const [color, setColor] = useState('black');
	const [isSelecting, setSelecting] = useState(false);
	const [palette, setPalette] = useState('white');

	const [pdf, setPdf] = React.useState('');
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

	useEffect(() => {
		pdf &&
			renderPage().then(() => {
				imagesList.forEach((element) => {
					handleImageFiles(element);
				});
			});
	}, [pdf]);

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
		EditList.imgSrc = file.base64;

		if (file.fileList) {
			Controller.uploadImg(UserData.userId, file.fileList[0]).then((response) => {
				EditList.strHtml = response.imgId;
				UserData.setImgs(response.data.img);

				EditManager.asynToComponent();
				props.saveFile();
			});
		} else {
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

	const handlePDFFiles = async (event) => {
		try {
			const file = event.target.files[0];
			const uri = URL.createObjectURL(file);
			let _PDF_DOC = await PDFJS.getDocument({ url: uri });
			setPdf(_PDF_DOC);
			pdfUploadRef.current.value = '';
		} catch (error) {
			alert(error.message);
		}
	};

	const renderPage = async () => {
		const canvas = canvasRef.current;

		for (let i = 1; i <= pdf.numPages; i++) {
			let page = await pdf.getPage(i);
			let viewport = page.getViewport({ scale: 1 });
			canvas.width = viewport.width;
			canvas.height = viewport.height;
			let render_context = {
				canvasContext: canvas.getContext('2d'),
				viewport: viewport,
			};
			await page.render(render_context).promise;
			imagesList.push({ base64: canvas.toDataURL() });
		}
	};

	const updateEditList = (List) => {
		EditManager.readFile(List);
	};
	const imageBackground = (
		<CircleBtn>
			{colorCircleBtn.map((element) => {
				return (
					<div
						className="colorSelector"
						key={'colorBtn' + element}
						style={{ color: element === 'white' ? 'black' : '', backgroundColor: element }}
						onClick={() => {
							setSelecting(false);
							setColor(element);
						}}
					>
						{color === element ? '✓' : ''}
					</div>
				);
			})}
			<span
				className="colorSpan"
				style={{ color: 'black', backgroundColor: palette, fontSize: isSelecting ? '' : '38px', paddingBottom: isSelecting ? '' : '5px' }}
				onClick={() => {
					setSelecting(true);
					colorInput.current.click();
				}}
			>
				{isSelecting ? '✓' : '+'}
			</span>
			<div style={{ position: 'relative' }}>
				<input
					type="color"
					ref={colorInput}
					style={{ visibility: 'hidden', position: 'absolute', left: '-45px', top: '-20px', zIndex: '2' }}
					onChange={(e) => {
						setColor(e.target.value);
						setPalette(e.target.value);
					}}
				/>
			</div>
			<div className="comfirmDiv">
				<Button onClick={(e) => drawNewPicture(color)}>確認</Button>
			</div>
		</CircleBtn>
	);

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
				<Popover placement="bottom" content={imageBackground} title="背景顏色">
					新增畫布
				</Popover>
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

				<Upload>
					<UploadOutlined onClick={() => pdfUploadRef.current.click()} />
					<input ref={pdfUploadRef} type="file" accept="application/pdf" hidden onChange={handlePDFFiles} />
				</Upload>

				<Dropdown menu={{ items: pictureItem }} trigger={['click']}>
					<FontAwesomeIcon icon={faImage} />
				</Dropdown>

				<Dropdown menu={{ items: recordItem }} placement="bottomLeft" trigger={['click']}>
					<img src={require('../../../assets/record_light.gif')} />
				</Dropdown>

				<Modal width="80vw" centered footer={null} closable={false} destroyOnClose open={isCamaraOpen} onCancel={() => setCamaraOpen(false)}>
					<OpenCamera close={() => setCamaraOpen(false)} handleImageFiles={handleImageFiles} />
				</Modal>
			</div>

		</div>
	);
};

export default ToolBar;
