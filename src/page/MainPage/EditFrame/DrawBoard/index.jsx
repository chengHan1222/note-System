import React from 'react';
import { Modal, Slider, Typography } from 'antd';

import style from './index.module.scss';

import classDrawBoard from '../../../../tools/DrawBoard';
import EditManager from '../../../../tools/EditFrame';
import StepControl from '../../../../tools/StepControl';

const { Title } = Typography;
const { useEffect, useState, useRef } = React;

const DrawBoard = (props) => {
	let colorCircleBtn = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', '#DABEA7', 'black', 'white'];

	const [intShowCircle, setShowCircle] = useState(9);
	const [isBarShow, setBarShow] = useState(true);
	const [color, setColor] = useState(classDrawBoard.color);
	const [palette, setPalette] = useState(classDrawBoard.color);
	const [size, setSize] = useState(classDrawBoard.size);
	const canvasRef = useRef();
	const backgroundRef = useRef();

	classDrawBoard.background = props.background;
	let bkCanvas;
	let bkCtx;
	const colorInput = useRef();

	useEffect(() => {
		window.addEventListener('resize', () => {
			if (!classDrawBoard.isDrawBoardOpen) return;
			changeImgSize();
			classDrawBoard.changeSize(bkCanvas.width, bkCanvas.height);
			changeColorSelector();
		});
	}, []);

	useEffect(() => {
		if (props.isOpen) {
			let interval = setInterval(() => {
				backgroundRef.current = document.getElementById('canvasBackgroundPic');
				if (backgroundRef.current !== undefined) {
					changeImgSize();
					setCanvas();
					changeColorSelector();
					clearInterval(interval);
				}
			}, 100);
		}
		classDrawBoard.isDrawBoardOpen = props.isOpen;
	}, [props.isOpen]);

	const changeImgSize = () => {
		if (backgroundRef.current === undefined) return;
		let maxWidth = parseInt(window.innerWidth * 0.9);
		let maxHeight = 700;
		let img = new Image();
		img.src = classDrawBoard.background;

		let widthScale = img.width / maxWidth;
		let heightScale = img.height / maxHeight;

		bkCanvas = backgroundRef.current;
		bkCtx = bkCanvas.getContext('2d');

		let width, height;
		if (widthScale > heightScale) {
			width = maxWidth;
			height = img.height / widthScale;
		} else {
			width = img.width / heightScale;
			height = maxHeight;
		}
		bkCanvas.width = width;
		bkCanvas.height = height;
		bkCtx.drawImage(img, 0, 0, width, height);

	};

	const changeColor = (changedColor) => {
		classDrawBoard.color = changedColor;
		classDrawBoard.isErasering = false;
		setColor(changedColor);
	};

	const changeColorSelector = () => {
		if (window.innerWidth >= 990) setShowCircle(9);
		else if (window.innerWidth >= 920) setShowCircle(7);
		else if (window.innerWidth >= 850) setShowCircle(6);
		else if (window.innerWidth >= 780) setShowCircle(5);
		else if (window.innerWidth >= 710) setShowCircle(4);
		else if (window.innerWidth >= 650) setShowCircle(3);
		else if (window.innerWidth >= 600) setShowCircle(2);
		else if (window.innerWidth >= 550) setShowCircle(1);
		else setShowCircle(0);
	};

	const changePenSize = (value) => {
		classDrawBoard.size = value;
		setSize(value);
	};

	const onCancel = () => {
		let lastCanvas = canvasRef.current.toDataURL();

		classDrawBoard.ctx.drawImage(backgroundRef.current, 0, 0, classDrawBoard.canvas.width, classDrawBoard.canvas.height);

		let draw = new Image();
		draw.src = lastCanvas;
		draw.crossOrigin = 'Anonymous';

		draw.onload = () => {
			classDrawBoard.ctx.drawImage(draw, 0, 0, classDrawBoard.canvas.width, classDrawBoard.canvas.height);

			let EditList = EditManager.lisEditList[EditManager.focusIndex];
			EditList.imgSrc = classDrawBoard.canvas.toDataURL();

			StepControl.addStep(EditManager.outputFile());

			classDrawBoard.ctx.clearRect(0, 0, classDrawBoard.canvas.width, classDrawBoard.canvas.height);
			classDrawBoard.changeSize(0, 0);
			classDrawBoard.isDrawBoardOpen = false;
			backgroundRef.current = undefined;
			props.setDrawBoardShow(false);
		};
	};

	const setCanvas = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		classDrawBoard.canvas = canvas;
		classDrawBoard.ctx = ctx;

		classDrawBoard.changeSize(bkCanvas.width, bkCanvas.height);
		classDrawBoard.save();

		ctx.strokeStyle = classDrawBoard.color;
		ctx.lineWidth = classDrawBoard.size;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';

		let imgScale = 1;
		classDrawBoard.scale = imgScale;

		let isDrawing = false;
		let lastX = 0;
		let lastY = 0;

		canvas.addEventListener('mouseup', () => {
			isDrawing = false;
			classDrawBoard.save(ctx);
			setBarShow(true);
		});
		canvas.addEventListener('mousedown', (e) => {
			isDrawing = true;
			[lastX, lastY] = [e.offsetX, e.offsetY];
			setBarShow(false);
		});
		canvas.addEventListener('mousemove', draw);

		document.addEventListener('keydown', (event) => {
			if (classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'z') {
				classDrawBoard.undo();
			}
			if (classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'y') {
				classDrawBoard.redo();
			}
		});

		function draw(e) {
			if (!isDrawing) return;

			ctx.lineWidth = classDrawBoard.size;
			if (classDrawBoard.isErasering) {
				ctx.clearRect(lastX, lastY, classDrawBoard.size, classDrawBoard.size);
			} else {
				ctx.strokeStyle = classDrawBoard.color;

				ctx.beginPath();
				ctx.moveTo(lastX, lastY);
				ctx.lineTo(e.offsetX, e.offsetY);
				ctx.stroke();
			}

			[lastX, lastY] = [e.offsetX, e.offsetY];
		}
	};

	return (
		<Modal centered width={'95vw'} open={props.isOpen} onCancel={onCancel} closable={false} title={null} footer={null}>
			<div className={style.container}>
				<div className={style.background}>
					<canvas id="canvasBackgroundPic" ref={backgroundRef}></canvas>
					{/* <img id="canvasBackgroundPic" alt="backgroundImg" ref={backgroundRef} src={props.background} /> */}
					<canvas ref={canvasRef} id="canvas" className={style.canvas}></canvas>
				</div>

				<div className={`${style.leftBar} ${isBarShow ? style.fadeIn : style.fadeOut}`} onMouseUp={(event) => event.preventDefault()}>
					<div className={style.centered}>
						<div
							className={style.eraser}
							style={{ backgroundColor: classDrawBoard.isErasering ? '#b1b1b1' : '' }}
							onClick={() => {
								classDrawBoard.isErasering = true;
								setColor('');
							}}
						>
							<img src={require('../../../../assets/eraser.png')} alt="eraser" />
						</div>
						<Title level={4} style={{ margin: '0 10px 0 0' }}>
							Size : {size}
						</Title>
						<Slider min={1} max={60} defaultValue={size} onChange={changePenSize} style={{ margin: '0 20px 0 10px', width: '100px' }} />

						<Title level={4} style={{ margin: '0 10px 0 0' }}>
							Color :
						</Title>
						<span
							className={style.circleBtn}
							style={{ backgroundColor: palette, fontSize: '38px', paddingBottom: '5px' }}
							onClick={() => {
								colorInput.current.click();
							}}
						>
							+
						</span>
						<div style={{ position: 'relative' }}>
							<input
								type="color"
								ref={colorInput}
								style={{ visibility: 'hidden', position: 'absolute', left: '-45px', top: '-20px', zIndex: '2' }}
								onClick={(e) => changeColor(e.target.value)}
								onChange={(e) => {
									changeColor(e.target.value);
									setPalette(e.target.value);
								}}
							/>
						</div>

						{colorCircleBtn.map((element, index) => {
							if (index < intShowCircle)
								return (
									<div
										key={'circleBtn' + element}
										className={style.circleBtn}
										style={{ color: element === 'white' ? 'black' : '', backgroundColor: element }}
										onClick={() => changeColor(element)}
									>
										{color === element ? '✓' : ''}
									</div>
								);
						})}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DrawBoard;
