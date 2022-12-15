import React from 'react';
import { Modal, Slider, Typography } from 'antd';

import style from './index.module.scss';

import classDrawBoard from '../../../../tools/DrawBoard';
import EditManager from '../../../../tools/EditFrame';

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
		// console.log(backgroundImg);
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

		// let widthScale = backgroundRef.current.clientWidth / maxWidth;
		// let heightScale = backgroundRef.current.clientHeight / maxHeight;

		// if (widthScale > heightScale) {
		// 	backgroundRef.current.style.width = maxWidth + 'px';
		// } else {
		// 	backgroundRef.current.style.height = maxHeight + 'px';
		// }
	};

	const changeColor = (color) => {
		classDrawBoard.color = color;
		classDrawBoard.isErasering = false;
		setColor(color);
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
			// console.log(EditList.imgSrc);

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

		let imgX = 0;
		let imgY = 0;
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

		// bkCanvas.onwheel = (event) => {
		// 	event.preventDefault();
		// 	let pos = windowToCanvas(event.clientX, event.clientY);
		// 	if (event.wheelDelta > 0) {
		// 		imgScale *= 2;
		// 		imgX = imgX * 2 - pos.x;
		// 		imgY = imgY * 2 - pos.y;
		// 	} else {
		// 		imgScale /= 2;
		// 		imgX = imgX * 0.5 - pos.x * 0.5;
		// 		imgY = imgY * 0.5 - pos.y * 0.5;
		// 	}
		// 	drawImage(); //重新绘制图片
		// };
		// canvas.onmousewheel = canvas.onwheel = function (event) {
		// 	let pos = windowToCanvas(event.clientX, event.clientY);
		// 	event.wheelDelta = event.wheelDelta ? event.wheelDelta : event.deltalY * -40;
		// 	if (event.wheelDelta > 0) {
		// 		imgScale *= 2;
		// 		imgX = imgX * 2 - pos.x;
		// 		imgY = imgY * 2 - pos.y;
		// 	} else {
		// 		imgScale /= 2;
		// 		imgX = imgX * 0.5 - pos.x * 0.5;
		// 		imgY = imgY * 0.5 - pos.y * 0.5;
		// 	}
		// };
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

		function drawImage() {
			bkCtx.clearRect(0, 0, bkCanvas.width, bkCanvas.height);
			bkCtx.drawImage(
				props.background, //规定要使用的图像、画布或视频。
				0,
				0, //开始剪切的 x 坐标位置。
				bkCanvas.width,
				bkCanvas.height, //被剪切图像的高度。
				imgX,
				imgY, //在画布上放置图像的 x 、y坐标位置。
				bkCanvas.width * imgScale,
				bkCanvas.height * imgScale //要使用的图像的宽度、高度
			);
			console.log(123);
		}

		function windowToCanvas(x, y) {
			var box = canvas.getBoundingClientRect(); //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
			return {
				x: x - box.left - (box.width - canvas.width) / 2,
				y: y - box.top - (box.height - canvas.height) / 2,
			};
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
