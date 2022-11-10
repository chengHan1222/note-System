import { useState, useEffect } from 'react';

const useRWD = () => {
	const [windowWidth, setWindowWidth] = useState(1260);

	const handleRWD = () => {
		if (window.innerWidth >= 1260) setWindowWidth(1260);
		else if (window.innerWidth >= 1110) setWindowWidth(1110);
		else if (window.innerWidth >= 1000) setWindowWidth(1000);
        else if (window.innerWidth >= 800) setWindowWidth(800);
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
