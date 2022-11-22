import React from 'react';
import Webcam from 'react-webcam';
import { Button, Col, Row, Space } from 'antd';

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

	const dataURItoBlob = (dataURI) => {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		var byteString = window.atob(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);

		// create a view into the buffer
		var ia = new Uint8Array(ab);

		// set the bytes of the buffer to the correct values
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		var blob = new Blob([ab], { type: mimeString });
		return blob;
	}

	return (
		<>
			<Space direction="vertical" style={{ width: '100%', display: takePic ? 'none' : '' }}>
				<Webcam
					ref={webcamRef}
					// audio={true}
					screenshotFormat="image/jpeg"
					videoConstraints={videoConstraints}
					onUserMedia={onUserMedia}
					width="100%"
				/>
				<Row type="flex" justify="center">
					<Col>
						<Button shape="round" size="large" onClick={capturePhoto}>
							拍照
						</Button>
					</Col>
				</Row>

				{url}
			</Space>

			<Space direction="vertical" style={{ width: '100%', display: takePic ? '' : 'none' }}>
				<img src={url} alt="Screenshot" />
				<Row type="flex" justify="center">
					<Space size="large">
						<Button
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
			</Space>
		</>
	);
};

export default Camera;
