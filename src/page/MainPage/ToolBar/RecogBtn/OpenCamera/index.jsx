import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';

const videoConstraints = {
	width: 540,
	facingMode: 'environment',
};

const Camera = (props) => {
	const webcamRef = useRef(null);
	const [url, setUrl] = React.useState(null);
	const [takePic, setTakePic] = React.useState(false);

	const capturePhoto = React.useCallback(async () => {
		const imageSrc = webcamRef.current.getScreenshot();
		props.handleImage(imageSrc);
		setUrl(imageSrc);
		setTakePic(true);
	}, [webcamRef]);

	const onUserMedia = (e) => {
		// console.log(e);
	};

	return (
		<>
			<div style={{ display: takePic ? 'none' : '' }}>
				<Webcam
					ref={webcamRef}
					audio={false}
					screenshotFormat="image/jpeg"
					videoConstraints={videoConstraints}
					onUserMedia={onUserMedia}
					width="100%"
				/>

				<Button variant="secondary" size="" onClick={capturePhoto} style={{ display: 'flex', margin: 'auto' }}>
					拍照
				</Button>

				{url}
			</div>

			<div style={{ display: takePic ? '' : 'none' }}>
				<img src={url} alt="Screenshot" />
				<Button
					variant="secondary"
					size=""
					onClick={() => {
						setUrl(null);
						setTakePic(false);
					}}
					style={{ display: 'flex', margin: 'auto' }}
				>
					刷新
				</Button>
			</div>
		</>
	);
};

export default Camera;
