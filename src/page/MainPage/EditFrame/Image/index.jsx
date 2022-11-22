import React from 'react';
import style from './index.module.scss';

const { useEffect, useRef, useState } = React;

let lastX, isMouseDown;
const Image = (props) => {
	const [imgWdith, setImgWidth] = useState(600);
	const ref = useRef();

	useEffect(() => {
		document.addEventListener('mousemove', changeWidth);
		document.addEventListener('mouseup', () => (isMouseDown = false));
	}, []);

	const handleMouseDown = (event) => {
		lastX = event.clientX;
		isMouseDown = true;
	};
	const changeWidth = (event) => {
		if (isMouseDown) {
			let changeX = event.clientX - lastX;
			setImgWidth((pre) => {
				if (pre >= event.path[1].clientWidth - 80) return event.path[1].clientWidth - 81;
				else if (pre < 150) return 150;
				return pre + changeX;
			});
			lastX = event.clientX;
		}
	};

	return (
		<>
			<div className={style.dragBar} style={{ left: '42px' }}></div>
			<img ref={ref} src={props.file.base64} className={style.EditImage} style={{ width: imgWdith }} />
			<div className={style.dragBar} style={{ left: imgWdith + 20 }} onMouseDown={handleMouseDown}></div>
		</>
	);
};

export default Image;
