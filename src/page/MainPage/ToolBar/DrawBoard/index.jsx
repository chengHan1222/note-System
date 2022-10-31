import React from 'react';
import { Modal } from 'antd';

import style from './index.module.scss';

const { useEffect, useState, useRef } = React;

const DrawBoard = (props) => {
	const [color, setColor] = useState('red');
	const colorInput = useRef();

	useEffect(() => {
		if (props.isOpen) setCanvas();
	}, [props.isOpen]);

	const changeColor = (event) => {
		setColor(event.target.value);
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
				<div className={style.leftBar}>
					<span
						className={`${style.penColor} ${style.circleBtn}`}
						style={{ backgroundColor: color }}
						onClick={() => {
							colorInput.current.click();
						}}
					></span>
					<input type="color" ref={colorInput} style={{ display: 'none' }} onChange={changeColor} />
				</div>
				<canvas id="draw"></canvas>
			</div>
		</Modal>
	);
};

function setCanvas() {
	const canvas = document.getElementById('draw');
	const ctx = canvas.getContext('2d');

	canvas.width = 850;
	canvas.height = 600;

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#bada55';
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.lineWidth = 1;

	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;

	canvas.addEventListener('mouseup', () => (isDrawing = false));
	canvas.addEventListener('mousedown', (e) => {
		isDrawing = true;
		[lastX, lastY] = [e.offsetX, e.offsetY];
	});
	canvas.addEventListener('mousemove', draw);

	function draw(e) {
		if (!isDrawing) return;

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();

		[lastX, lastY] = [e.offsetX, e.offsetY];

		let hue = 0; // 色相環度數從 0 開始 (的異世界!? XD)
		let direction = true;

		rainbow();
		telescopicWidth();

		function rainbow() {
			// 透過 context 的 strokeStyle 設定筆畫顏色
			ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

			hue++; // 色相環 度數更新
			if (hue >= 360) {
				hue = 0;
			}
		}

		function telescopicWidth() {
			/* 如果 >=100 或者 <=1 則筆觸大小反向動作 */
			if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
				direction = !direction;
			}

			/* 筆觸粗細實作 */
			if (direction) {
				ctx.lineWidth++;
			} else {
				ctx.lineWidth--;
			}
		}
	}
}

export default DrawBoard;
