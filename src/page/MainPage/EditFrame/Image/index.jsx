import React from 'react';
import style from './index.module.scss';

const { useEffect, useRef, useState } = React;

let lastX, isMouseDown;
const Image = (props) => {
	const [imgWidth, setImgWidth] = useState(600);

	useEffect(() => {
		document.addEventListener('mousemove', changeWidth);
		window.addEventListener('mouseup', () => (isMouseDown = false));
	}, []);

	const handleMouseDown = (event) => {
		lastX = event.clientX;
		isMouseDown = true;
	};
	const changeWidth = (event) => {
		if (isMouseDown) {
			let changeX = event.clientX - lastX;
			setImgWidth((pre) => {
				if (pre < 150) return 150;
				return pre + changeX;
			});
			lastX = event.clientX;
		}
	};

	return (
		<div  className={style.EditImage} style={{ width: imgWidth }}>
			<div className={style.dragBar} style={{ left: '12px', height: imgWidth < 350 ? imgWidth / 4 : {} }}></div>
			<img draggable={false} src={props.file.base64} className={style.Image} />
			<div className={style.dragBar} style={{ right: '12px', height: imgWidth < 350 ? imgWidth / 4 : {} }} onMouseDown={handleMouseDown}></div>
		</div>
	);
};

export default Image;
