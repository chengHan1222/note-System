import React from 'react';
import { Modal, Slider, Typography } from 'antd';

import style from './index.module.scss';

import classDrawBoard from '../../../../tools/DrawBoard';

const { Title } = Typography;
const { useEffect, useState, useRef } = React;

const DrawBoard = (props) => {
	const [color, setColor] = useState(classDrawBoard.color);
	const [palette, setPalette] = useState(classDrawBoard.color);
	const [size, setSize] = useState(classDrawBoard.size);
	const canvasRef = useRef();
	const backgroundRef = useRef();
	const colorInput = useRef();

	useEffect(() => {
		if (props.isOpen && backgroundRef.current.clientWidth !== 0) setCanvas();
		classDrawBoard.isDrawBoardOpen = props.isOpen;
	}, [props.isOpen]);

	useEffect(() => {
		window.addEventListener('resize', () =>{
			if (!props.isOpen) return;
			changeCanvasSize();
		})
	}, [])

	const changeColor = (color) => {
		classDrawBoard.color = color;
		classDrawBoard.isErasering = false;
		setColor(color);
	};

	const changeSize = (value) => {
		classDrawBoard.size = value;
		setSize(value);
	};

	const changeCanvasSize = () => {
		classDrawBoard.canvas.width = backgroundRef.current.clientWidth;
		classDrawBoard.canvas.height = backgroundRef.current.clientHeight;
	}

	const setCanvas = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		classDrawBoard.canvas = canvas;
		classDrawBoard.ctx = ctx;

		changeCanvasSize();
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
		});
		canvas.addEventListener('mousedown', (e) => {
			isDrawing = true;
			[lastX, lastY] = [e.offsetX, e.offsetY];
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
		<Modal
			centered
			width={1000}
			open={props.isOpen}
			onCancel={() => props.setDrawBoardShow(false)}
			onOk={() => props.setDrawBoardShow(false)}
			closable={false}
			title={null}
			footer={null}
		>
			<div className={style.container}>
				<div ref={backgroundRef} className={style.background} style={{ backgroundImage: `url(${props.background})` }}>
					<canvas ref={canvasRef} id="canvas"></canvas>
				</div>

				<div className={style.leftBar} onMouseUp={(event) => event.preventDefault()}>
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

// function setCanvas() {
// 	const canvas = new fabric.Canvas('canvas', {
// 		width: 950,
// 		height: 600,
// 		isDrawingMode: false, // 設置成 true 一秒變身小畫家
// 		hoverCursor: 'progress', // 移動時鼠標顯示
// 		freeDrawingCursor: 'all-scroll', // 畫畫模式時鼠標模式
// 		backgroundColor: 'black', // 背景色,
// 		// backgroundImage: 'https://www.pakutaso.com/shared/img/thumb/neko1869IMG_9074_TP_V.jpg', // 背景圖片
// 	});
// 	canvas.isDrawingMode = true;
// 	canvas.on('mouse:down', (e) => {
// 		canvas.freeDrawingBrush.color = classDrawBoard.color;
// 		canvas.freeDrawingBrush.width = classDrawBoard.size;
// 	});
// 	canvas.on('mouse:move', (e) => {
// 		canvas.freeDrawingBrush.color = classDrawBoard.color;
// 		canvas.freeDrawingBrush.width = classDrawBoard.size;
// 	});
// }

// function setCanvas() {
// 	const canvas = document.getElementById('draw');
// 	let ctx = canvas.getContext('2d');

// 	canvas.width = 950;
// 	canvas.height = 600;

// 	ctx.fillStyle = 'black';
// 	ctx.fillRect(0, 0, canvas.width, canvas.height);

// 	classDrawBoard.createLayer();
// 	ctx = classDrawBoard.getFocusCtx();

// 	ctx.strokeStyle = classDrawBoard.color;
// 	ctx.lineJoin = 'round';
// 	ctx.lineCap = 'round';
// 	ctx.lineWidth = classDrawBoard.size;

// 	let isDrawing = false;
// 	let lastX = 0;
// 	let lastY = 0;

// 	canvas.addEventListener('mouseup', () => {
// 		isDrawing = false;
// 		classDrawBoard.save(ctx);
// 	});
// 	canvas.addEventListener('mousedown', (e) => {
// 		isDrawing = true;
// 		[lastX, lastY] = [e.offsetX, e.offsetY];
// 	});
// 	canvas.addEventListener('mousemove', draw);
// 	document.addEventListener('keydown', (event) => {
// 		console.log(classDrawBoard.layer);
// 		if (classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'z') {
// 			classDrawBoard.restore(ctx);
// 		}
// 		if (classDrawBoard.isDrawBoardOpen && event.ctrlKey && event.key === 'y') {
// 		}
// 	});

// 	function draw(e) {
// 		if (!isDrawing) return;

// 		if (classDrawBoard.isErasering) {
// 			ctx.clearRect(lastX, lastY, classDrawBoard.size, classDrawBoard.size);
// 		} else {
// 			ctx.strokeStyle = classDrawBoard.color;
// 			ctx.lineWidth = classDrawBoard.size;

// 			ctx.beginPath();
// 			ctx.moveTo(lastX, lastY);
// 			ctx.lineTo(e.offsetX, e.offsetY);
// 			ctx.stroke();
// 		}

// 		[lastX, lastY] = [e.offsetX, e.offsetY];
// 	}
// }

export default DrawBoard;
