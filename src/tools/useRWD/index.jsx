import { useState, useEffect } from 'react';

const useRWD = () => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const handleRWD = () => {
		if (window.innerWidth >= 1260) setWindowWidth(1260);
		else if (window.innerWidth >= 1050) setWindowWidth(1050);
		else if (window.innerWidth >= 930) setWindowWidth(930);
		else if (window.innerWidth >= 830) setWindowWidth(830);
		else if (window.innerWidth >= 730) setWindowWidth(730);
		else if (window.innerWidth >= 630) setWindowWidth(630);
		else setWindowWidth(600);
	};

	useEffect(() => {
		window.addEventListener('resize', handleRWD);
		return () => {
			window.removeEventListener('resize', handleRWD);
		};
	}, []);

	return windowWidth;
};

export default useRWD;
