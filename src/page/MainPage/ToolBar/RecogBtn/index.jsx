import React from 'react';
import ReactFileReader from 'react-file-reader';
import './index.scss';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Recorder from './Recorder';
import ContentEditable from 'react-contenteditable';

class RecogBtn extends React.PureComponent {
	constructor(props) {
		super(props);
		this.isChanging = false;

		this.state = {
			imageDisplay: null,
			recordDisplay: null,
			recordResult: '',
			imageResult: '',
			imageCopyStatus: false,
			recordCopyStatus: false,
			imageFile: null,
			recordFile: null,
		};

		this.changeResult = this.changeResult.bind(this);
		this.copyResult = this.copyResult.bind(this);
		this.blockShow = this.blockShow.bind(this);
		this.blockHide = this.blockHide.bind(this);
		this.handleRecordFiles = this.handleRecordFiles.bind(this);

		// let mouseDown = false;
		// document.addEventListener('mousedown', (event) => {
		// 	if (
		// 		!mouseDown &&
		// 		event.target.className.indexOf('recog') === -1 &&
		// 		event.target.className.indexOf('file') === -1
		// 	) {
		// 		if (this.state.imageDisplay === true || this.state.recordDisplay === true) {
		// 			this.isChanging = true;
		// 			this.setState(
		// 				{
		// 					imageDisplay: this.state.recordDisplay === null ? null : false,
		// 					recordDisplay: this.state.recordDisplay === null ? null : false,
		// 					imageCopyStatus: false,
		// 					recordCopyStatus: false,
		// 				},
		// 				() => {
		// 					this.isChanging = false;
		// 				}
		// 			);
		// 		}
		// 		mouseDown = true;
		// 	}
		// });
		// document.addEventListener('mouseup', (event) => {
		// 	mouseDown = false;
		// });
	}

	changeResult(type, content) {
		if (type === 'record') {
			this.setState({
				recordFile: null,
				recordResult: this.state.recordResult.substring(0, this.state.recordResult.length - 3) + content + '。',
			});
		} else if (type === 'image') {
			this.setState({
				imageFile: null,
				imageResult: this.state.imageResult + content + '。',
			});
		}
	}

	sendImageRequire() {
		if (!this.state.imageFile) return;
		//向後端要資料

		let imageFile = new FormData();
		imageFile.append('image', this.state.imageFile.fileList[0]);

		axios
			.post('http://127.0.0.1:5000/image', imageFile)
			.then((response) => {
				console.log(response);
				this.changeResult('image', response.data);
			})
			.catch((error) => console.log(error));
	}

	sendRecordRequire() {
		if (!this.state.recordFile) return;

		this.setState({ recordResult: this.state.recordResult + '...' });

		let voiceFile = new FormData();
		voiceFile.append('voice', this.state.recordFile.fileList[0]);
		//向後端要資料
		axios
			.post('http://127.0.0.1:5000/voice', voiceFile)
			.then((response) => {
				this.changeResult('record', response.data);
			})
			.catch((error) => console.log(error));
	}

	copyResult(type) {
		// 全選
		let div;
		if (type === 'image') {
			div = document.getElementById('imageResult');
		} else if (type === 'record') {
			div = document.getElementById('recordResult');
		}
		var range, selection;
		if (document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(div);
			range.select();
		} else if (window.getSelection) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(div);
			selection.removeAllRanges();
			selection.addRange(range);
		}

		// 按鈕變化
		if (type === 'image') {
			if (this.state.imageCopyStatus === false) {
				this.setState({
					imageCopyStatus: true,
				});
			}
		} else if (type === 'record') {
			if (this.state.recordCopyStatus === false) {
				this.setState({
					recordCopyStatus: true,
				});
			}
		}
	}

	blockShow(type) {
		if (this.isChanging) return;

		let display;
		if (type === 'image') {
			display = this.state.imageDisplay;
		} else if (type === 'record') {
			display = this.state.recordDisplay;
		}
		if (display === null) display = false;

		this.isChanging = true;
		if (type === 'image') {
			this.setState(
				{
					imageDisplay: !display,
					recordDisplay: this.state.recordDisplay === null ? null : false,
					imageCopyStatus: false,
					recordCopyStatus: false,
				},
				() => {
					this.isChanging = false;
				}
			);
		} else if (type === 'record') {
			this.setState(
				{
					imageDisplay: this.state.imageDisplay === null ? null : false,
					recordDisplay: !display,
					imageCopyStatus: false,
					recordCopyStatus: false,
				},
				() => {
					this.isChanging = false;
				}
			);
		}
	}

	blockHide() {
		if (this.state.imageDisplay === true || this.state.recordDisplay === true) {
			this.isChanging = true;
			this.setState(
				{
					imageDisplay: this.state.recordDisplay === null ? null : false,
					recordDisplay: this.state.recordDisplay === null ? null : false,
					imageCopyStatus: false,
					recordCopyStatus: false,
				},
				() => {
					this.isChanging = false;
				}
			);
		}
	}

	handleChange = (event, type) => {
		if (type === 'image') {
			this.setState({ imageResult: event.target.value });
		} else if (type === 'record') {
			this.setState({ recordResult: event.target.value });
		}
	};

	handleImageFiles = async (file) => {
		this.setState({
			imageFile: file,
		});
	};

	handleRecordFiles = async (file) => {
		this.setState({
			recordFile: file,
		});
	};

	render() {
		return (
			<>
				<div className="recogBtnBlock">
					<div
						className="clickRecogBtn"
						style={this.state.imageDisplay ? { backgroundColor: 'transparent', borderColor: 'black' } : {}}
					>
						<img
							src={require('../../../../assets/camera3.png')}
							onClick={() => this.blockShow('image')}
							className="recogImg"
						/>
					</div>
					<div
						className="clickRecogBtn"
						style={this.state.recordDisplay ? { backgroundColor: 'transparent', borderColor: 'black' } : {}}
					>
						<img
							src={require('../../../../assets/record3.png')}
							onClick={() => this.blockShow('record')}
							className="recogImg"
						/>
					</div>
				</div>

				{/* <div
					className={`animateBlock ${this.state.recordDisplay ? 'animateBlockShow' : 'animateBlockClose'}`}
					style={{ display: this.state.recordDisplay === null ? 'none' : '' }}
					onMouseDown={(event) => {
						event.stopPropagation();
					}}
				>
				</div> */}

				<Modal
					show={this.state.imageDisplay}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					className={`${this.state.imageDisplay ? 'animateBlockShow' : 'animateBlockClose'}`}
					style={{ display: this.state.imageDisplay === null ? 'none' : '' }}
					onHide={this.blockHide}
					centered
				>
					{/* <Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">heading</Modal.Title>
					</Modal.Header> */}

					<table className="recogBlock">
						<div className="blockHeader">
							<Button variant="outline-secondary" onClick={this.blockHide}>
								X
							</Button>
						</div>

						<tbody>
							<tr>
								<td className="fileBtnCenter">
									<ReactFileReader
										fileTypes={['.jpg', '.png', '.jpeg', '.gif']}
										base64={true}
										multipleFiles={false}
										handleFiles={this.handleImageFiles}
									>
										<div>
											<img src={require('../../../../assets/camera2.png')} className="fileImg2" />
											<div className={this.state.imageFile ? `fileText colorShake` : `fileText`}>上傳圖片</div>
										</div>
									</ReactFileReader>
								</td>
								<td className="textResult">
									<img
										src={require('../../../../assets/transfromBtn.png')}
										className="transfromBtn"
										onClick={this.sendImageRequire.bind(this)}
									/>

									<ContentEditable
										id="imageResult"
										className="resultSpace"
										html={this.state.imageResult}
										onChange={(event) => this.handleChange(event, 'image')}
									/>

									<button
										onClick={() => this.copyResult('image')}
										className={this.state.imageCopyStatus ? 'afterClick' : 'copyBtn'}
									>
										{this.state.imageCopyStatus ? 'copied' : 'copy'}
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</Modal>
				<Modal
					show={this.state.recordDisplay}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					className={`${this.state.recordDisplay ? 'animateBlockShow' : 'animateBlockClose'}`}
					style={{ display: this.state.recordDisplay === null ? 'none' : '' }}
					onHide={this.blockHide}
					centered
				>
					<table className="recogBlock">
						<div className="blockHeader">
							<Button variant="outline-secondary" onClick={this.blockHide}>
								X
							</Button>
						</div>

						<tbody>
							<tr>
								<td className="fileBtnCenter">
									<ReactFileReader
										fileTypes={['.wav']}
										base64={true}
										multipleFiles={false}
										handleFiles={this.handleRecordFiles}
									>
										<div>
											<img src={require('../../../../assets/record2.png')} className="fileImg2" />
											<div className={this.state.recordFile ? `fileText colorShake` : `fileText`}>上傳音檔</div>
										</div>
									</ReactFileReader>
								</td>
								<td className="textResult">
									<img
										src={require('../../../../assets/transfromBtn.png')}
										className="transfromBtn"
										onClick={this.sendRecordRequire.bind(this)}
									/>
									<ContentEditable
										id="recordResult"
										className="resultSpace"
										html={this.state.recordResult}
										onChange={(event) => this.handleChange(event, 'record')}
									/>

									<button
										onClick={() => this.copyResult('record')}
										className={this.state.recordCopyStatus ? 'afterClick' : 'copyBtn'}
									>
										{this.state.recordCopyStatus ? 'copied' : 'copy'}
									</button>
									<button className="copyBtn">
										<i className="fa-solid fa-trash-can"></i>
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
				</Modal>
			</>
		);
	}
}
export default RecogBtn;
