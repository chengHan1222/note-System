import React from 'react';
import Webcam from 'react-webcam';
import { Col, Row, Space } from 'antd';
import { Button } from 'react-bootstrap';

const videoConstraints = {
	width: 540,
	facingMode: 'environment',
};

const { useCallback, useRef, useState } = React;

const Camera = (props) => {
	const webcamRef = useRef(null);
	const [url, setUrl] = useState(null);
	const [takePic, setTakePic] = useState(false);

	const capturePhoto = useCallback(async () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setUrl(imageSrc);
		setTakePic(true);
	}, [webcamRef]);

	const onUserMedia = (e) => {
		console.log(e);
	};

	return (
		<>
			<div style={{ width: '100%', display: takePic ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Webcam
					ref={webcamRef}
					// audio={true}
					screenshotFormat="image/jpeg"
					videoConstraints={videoConstraints}
					onUserMedia={onUserMedia}
					width="70%"
				/>
				<Row type="flex" justify="center" style={{ marginTop: '10px' }}>
					<Col>
						<Button shape="round" size="large" onClick={capturePhoto}>
							拍照
						</Button>
					</Col>
				</Row>

				{url}
			</div>

			<div style={{ width: '100%', display: takePic ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center' }}>
				<img src={url} alt="Screenshot" />
				<Row type="flex" justify="center" style={{ marginTop: '10px' }}>
					<Space size="large">
						<Button
							type="primary"
							shape="round"
							size="large"
							onClick={() => {
								setUrl(null);
								setTakePic(false);
							}}
						>
							刷新
						</Button>
						<Button
							type="primary"
							shape="round"
							size="large"
							onClick={() => {
								props.handleImageFiles({ base64: url });
								props.close();
							}}
						>
							儲存
						</Button>
					</Space>
				</Row>
			</div>
		</>
	);
};

export default Camera;
