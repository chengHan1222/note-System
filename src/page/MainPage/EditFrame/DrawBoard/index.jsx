import React from 'react';
import { Modal, Slider, Typography } from 'antd';

import style from './index.module.scss';

import classDrawBoard from '../../../../tools/DrawBoard';
import EditManager from '../../../../tools/EditFrame';

const { Title } = Typography;
const { useEffect, useState, useRef } = React;

const DrawBoard = (props) => {
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
			changeCanvasSize();
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
		let width = backgroundRef.current.clientWidth;
		let height = backgroundRef.current.clientHeight;

		if (width > height) {
			backgroundRef.current.style.width = window.innerWidth * 0.9 + 'px';
			backgroundRef.current.style.height = (height * window.innerWidth * 0.9) / width + 'px';
			// return { width: window.innerWidth * 0.9, height: (height * window.innerWidth) / width };
		} else {
			backgroundRef.current.style.width = (width * window.innerHeight * 0.9) / height + 'px';
			backgroundRef.current.style.height = window.innerHeight * 0.9 + 'px';
			// return { width: (width * window.innerHeight) / height, height: window.innerHeight * 0.9 };
		}
	};

	const changeColor = (color) => {
		classDrawBoard.color = color;
		classDrawBoard.isErasering = false;
		setColor(color);
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

			EditManager.lisEditList[EditManager.focusIndex].strHtml = { base64: classDrawBoard.canvas.toDataURL() };

			classDrawBoard.ctx.clearRect(0, 0, classDrawBoard.canvas.width, classDrawBoard.canvas.height);
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
		<Modal centered width={window.clientWidth * 0.9 + 'px'} open={props.isOpen} onCancel={onCancel} closable={false} title={null} footer={null}>
			<div className={style.container}>
				<div className={style.background}>
					<img id="canvasBackgroundPic" ref={backgroundRef} src={props.background} />
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
						<div className={style.circleBtn} style={{ backgroundColor: 'red' }} onClick={() => changeColor('red')}>
							{color === 'red' ? '✓' : ''}
						</div>

						<div className={style.circleBtn} style={{ backgroundColor: 'orange' }} onClick={() => changeColor('orange')}>
							{color === 'orange' ? '✓' : ''}
						</div>
						<div className={style.circleBtn} style={{ backgroundColor: 'yellow' }} onClick={() => changeColor('yellow')}>
							{color === 'yellow' ? '✓' : ''}
						</div>
						<div className={style.circleBtn} style={{ backgroundColor: 'green' }} onClick={() => changeColor('green')}>
							{color === 'green' ? '✓' : ''}
						</div>
						<div className={style.circleBtn} style={{ backgroundColor: 'blue' }} onClick={() => changeColor('blue')}>
							{color === 'blue' ? '✓' : ''}
						</div>
						<div className={style.circleBtn} style={{ backgroundColor: 'purple' }} onClick={() => changeColor('purple')}>
							{color === 'purple' ? '✓' : ''}
						</div>
						<div className={style.circleBtn} style={{ backgroundColor: '#DABEA7' }} onClick={() => changeColor('#DABEA7')}>
							{color === '#DABEA7' ? '✓' : ''}
						</div>
						<div className={style.circleBtn} style={{ backgroundColor: 'black' }} onClick={() => changeColor('black')}>
							{color === 'black' ? '✓' : ''}
						</div>
						<div className={style.circleBtn} style={{ color: 'black', backgroundColor: 'white' }} onClick={() => changeColor('white')}>
							{color === 'white' ? '✓' : ''}
						</div>
						<span
							className={style.circleBtn}
							style={{ backgroundColor: palette, fontSize: '38px', paddingBottom: '5px' }}
							onClick={() => {
								colorInput.current.click();
							}}
						>
							+
						</span>
						<input
							type="color"
							ref={colorInput}
							style={{ display: 'none' }}
							onClick={(e) => changeColor(e.target.value)}
							onChange={(e) => {
								changeColor(e.target.value);
								setPalette(e.target.value);
							}}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DrawBoard;
