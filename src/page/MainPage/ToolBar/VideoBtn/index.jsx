import React from 'react';
import ReactFileReader from 'react-file-reader';
import './index.scss';
import axios from 'axios';

import Recorder from './Recorder';

class videoBtn extends React.PureComponent {
	constructor(props) {
		super(props);
		this.isChanging = false;

		this.state = {
			videoDisplay: null,
			recordDisplay: null,
			recordResult: '',
			videoResult:
				'1111111111111111111231232311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111233333333333333',
			videoCopyStatus: false,
			recordCopyStatus: false,
			videoFile: null,
			recordFile: null,
		};

		this.changeResult = this.changeResult.bind(this);
		this.handleVideoFiles = this.handleVideoFiles.bind(this);
		this.handleRecordFiles = this.handleRecordFiles.bind(this);

		let mouseDown = false;
		document.addEventListener('mousedown', (event) => {
			if (!mouseDown && event.target.className.indexOf('video') === -1) {
				if (this.state.videoDisplay === true || this.state.recordDisplay === true) {
					this.isChanging = true;
					this.setState(
						{
							videoDisplay: this.state.recordDisplay === null ? null : false,
							recordDisplay: this.state.recordDisplay === null ? null : false,
							videoCopyStatus: false,
							recordCopyStatus: false,
						},
						() => {
							this.isChanging = false;
						}
					);
				}
				mouseDown = true;
			}
		});
		document.addEventListener('mouseup', (event) => {
			mouseDown = false;
		});
	}

	changeResult(type, content) {
		if (type === 'record') {
			this.setState({
				recordFile: null,
				recordResult: content,
			});
		} else if (type === 'video') {
			this.setState({
				videoFile: null,
				videoResult: content,
			});
		}
	}

	sendVideoRequire() {
		if (!this.state.videoFile) return;
		//向後端要資料
	}

	sendRecordRequire() {
		if (!this.state.recordFile) return;

		// console.log(this.state.recordFile.fileList[0]);
		// let base64 = this.state.recordFile.base64.split(',');
		// console.log(this.state.recordFile.fileList[0]);
		let voiceFile = new FormData();
		voiceFile.append('voice', this.state.recordFile.fileList[0]);
		//向後端要資料
		// axios
		// 	.post('http://127.0.0.1:5000/voiceFile', {
		// 		type: base64[0],
		// 		content: base64[1],
		// 		size: this.state.recordFile.fileList[0].size,
		// 	})
		// 	.then((response) => {
		// 		console.log(response);
		// 		this.changeResult('record', response.data);
		// 	})
		// 	.catch((error) => console.log(error));
		axios
			.post('http://127.0.0.1:5000/voice', voiceFile)
			.then((response) => {
				console.log(response);
				this.changeResult('record', response.data);
			})
			.catch((error) => console.log(error));
	}

	videoCopyResult() {
		if (this.state.videoCopyStatus === false) {
			this.setState({
				videoCopyStatus: true,
			});
		}
	}

	recordCopyResult() {
		if (this.state.recordCopyStatus === false) {
			this.setState({
				recordCopyStatus: true,
			});
		}
	}

	videoShow() {
		if (this.isChanging) return;

		let display = this.state.videoDisplay;
		if (display === null) display = false;

		this.isChanging = true;
		this.setState(
			{
				videoDisplay: !display,
				recordDisplay: this.state.recordDisplay === null ? null : false,
				videoCopyStatus: false,
				recordCopyStatus: false,
			},
			() => {
				this.isChanging = false;
			}
		);
	}

	recordShow() {
		if (this.isChanging) return;

		let display = this.state.recordDisplay;
		if (display === null) display = false;

		this.isChanging = true;
		this.setState(
			{
				videoDisplay: this.state.videoDisplay === null ? null : false,
				recordDisplay: !display,
				videoCopyStatus: false,
				recordCopyStatus: false,
			},
			() => {
				this.isChanging = false;
			}
		);
	}

	handleVideoFiles = async (file) => {
		this.setState({
			videoFile: file,
		});
	};

	handleRecordFiles = async (file) => {
		this.setState({
			recordFile: file,
		});
	};

	onFileChange(event) {
		console.log(event.target.files[0]);
	}

	render() {
		return (
			<>
				<div id="btnBlock" className="btnBlock">
					<div
						className="videoBtn"
						style={this.state.videoDisplay ? { backgroundColor: 'transparent', borderColor: 'black' } : {}}
					>
						<img
							src={require('../../../../assets/camera3.png')}
							onClick={this.videoShow.bind(this)}
							className="videoImg"
						/>
					</div>
					<div
						className="videoBtn"
						style={this.state.recordDisplay ? { backgroundColor: 'transparent', borderColor: 'black' } : {}}
					>
						<img
							src={require('../../../../assets/record3.png')}
							onClick={this.recordShow.bind(this)}
							className="videoImg"
						/>
					</div>
				</div>
				<div
					className={`animateBlock ${this.state.videoDisplay ? 'animateBlockShow' : 'animateBlockClose'}`}
					style={{ display: this.state.videoDisplay === null ? 'none' : '' }}
					onMouseDown={(event) => {
						event.stopPropagation();
					}}
				>
					<table className="videoBlock">
						<tbody>
							<tr>
								<td className="videoBtnCenter">
									<ReactFileReader
										fileTypes={['.jpg', '.png', '.jpeg', '.gif']}
										base64={true}
										multipleFiles={false}
										handleFiles={this.handleVideoFiles}
									>
										<div>
											<img src={require('../../../../assets/camera2.png')} className="videoImg2" />
											<div className={this.state.recordFile ? `videoText colorShake` : `videoText`}>上傳圖片</div>
										</div>
									</ReactFileReader>
								</td>
								<td className="videoResult">
									<img
										src={require('../../../../assets/transfromBtn.png')}
										className="transfromBtn"
										onClick={this.sendVideoRequire.bind(this)}
									/>
									<div className="resultSpace">{this.state.videoResult}</div>
									<button
										onClick={this.videoCopyResult.bind(this)}
										className={this.state.videoCopyStatus ? 'afterClick' : 'copyBtn'}
									>
										{this.state.videoCopyStatus ? 'copied' : 'copy'}
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div
					className={`animateBlock ${this.state.recordDisplay ? 'animateBlockShow' : 'animateBlockClose'}`}
					style={{ display: this.state.recordDisplay === null ? 'none' : '' }}
					onMouseDown={(event) => {
						event.stopPropagation();
					}}
				>
					<table className="videoBlock">
						<tbody>
							<tr>
								<td className="videoBtnCenter">
									<ReactFileReader
										fileTypes={['.wav']}
										base64={true}
										multipleFiles={false}
										handleFiles={this.handleRecordFiles}
									>
										<div>
											<img src={require('../../../../assets/record2.png')} className="videoImg2" />
											<div className={this.state.recordFile ? `videoText colorShake` : `videoText`}>上傳音檔</div>
										</div>
									</ReactFileReader>
								</td>
								<td className="videoResult">
									<img
										src={require('../../../../assets/transfromBtn.png')}
										className="transfromBtn"
										onClick={this.sendRecordRequire.bind(this)}
									/>
									<div className="resultSpace">{this.state.recordResult}</div>
									<button
										onClick={this.recordCopyResult.bind(this)}
										className={this.state.recordCopyStatus ? 'afterClick' : 'copyBtn'}
									>
										{this.state.recordCopyStatus ? 'copied' : 'copy'}
									</button>
								</td>
							</tr>
							<tr>
								<td>
									<Recorder changeResult={this.changeResult} />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</>
		);
	}
}
export default videoBtn;
