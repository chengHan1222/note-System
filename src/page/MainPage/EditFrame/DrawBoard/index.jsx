import React from 'react';
import { Modal, Slider, Typography } from 'antd';

import style from './index.module.scss';

import classDrawBoard from '../../../../tools/DrawBoard';
import EditManager from '../../../../tools/EditFrame';

const { Title } = Typography;
const { useEffect, useState, useRef } = React;

const DrawBoard = (props) => {
	let intShowCircle = 8;
	let colorCircleBtn = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', '#DABEA7', 'black', 'white'];

	const [isBarShow, setBarShow] = useState(true);
	const [color, setColor] = useState(classDrawBoard.color);
	const [palette, setPalette] = useState(classDrawBoard.color);
	const [size, setSize] = useState(classDrawBoard.size);
	const canvasRef = useRef();
	const backgroundRef = useRef();
	const colorInput = useRef();

	useEffect(() => {
		window.addEventListener('resize', () => {
			if (!props.isOpen) return;
			changeImgSize();
			changeCanvasSize(backgroundRef.current.clientWidth, backgroundRef.current.clientHeight);
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
					clearInterval(interval);
				}
			}, 100);
		}
		classDrawBoard.isDrawBoardOpen = props.isOpen;
	}, [props.isOpen]);

	const changeImgSize = () => {
		if (backgroundRef.current === undefined) return;
		let maxWidth = parseInt(window.innerWidth * 0.9);
		let maxHeight = 600;
		let widthScale = backgroundRef.current.clientWidth / maxWidth;
		let heightScale = backgroundRef.current.clientHeight / maxHeight;

		if (widthScale > heightScale) {
			backgroundRef.current.style.width = maxWidth + 'px';
		} else {
			backgroundRef.current.style.height = maxHeight + 'px';
		}
	};

	const changeColor = (color) => {
		classDrawBoard.color = color;
		classDrawBoard.isErasering = false;
		setColor(color);
	};

	const changeColorSelector = () => {
		console.log(123)
		if (window.innerWidth < 990) {
			intShowCircle = 6;
			console.log('66');
		} else if (window.innerWidth < 920) intShowCircle = 5;
	};

	const changeSize = (value) => {
		classDrawBoard.size = value;
		setSize(value);
	};

	const changeCanvasSize = (width, height) => {
		classDrawBoard.canvas.width = width;
		classDrawBoard.canvas.height = height;
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
			// console.log(EditList.imgSrc);

			classDrawBoard.ctx.clearRect(0, 0, classDrawBoard.canvas.width, classDrawBoard.canvas.height);
			changeCanvasSize(0, 0);
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

		changeCanvasSize(backgroundRef.current.clientWidth, backgroundRef.current.clientHeight);
		classDrawBoard.save();

		// ***********************************************
		// const image = new Image();
		// image.src = '../../../../assets/thumb-1920-977095.jpg';
		// image.onload = () => {
		// 	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		// };
		// ***********************************************

		ctx.strokeStyle = classDrawBoard.color;
		ctx.lineWidth = classDrawBoard.size;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';

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
					<img id="canvasBackgroundPic" alt="backgroundImg" ref={backgroundRef} src={props.background} />
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
						<Slider min={1} max={60} defaultValue={size} onChange={changeSize} style={{ margin: '0 20px 0 10px', width: '100px' }} />

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
							if (index <= intShowCircle)
								return (
									<div
										key={'circleBtn' + element}
										className={style.circleBtn}
										style={{ color: element == 'white' ? 'black' : '', backgroundColor: element }}
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
