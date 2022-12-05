import React from 'react';
import ReactFileReader from 'react-file-reader';
import './index.scss';

import Modal from 'react-bootstrap/Modal';

import Recorder from './Recorder';
import ContentEditable from 'react-contenteditable';

import Controller from '../../../../tools/Controller';

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
			imageData: null,
			recordFile: null,

			camera: false,
		};

		this.changeResult = this.changeResult.bind(this);
		this.copyResult = this.copyResult.bind(this);
		this.blockShow = this.blockShow.bind(this);
		this.blockHide = this.blockHide.bind(this);
		this.handleImageData = this.handleImageData.bind(this);
		this.handleRecordFiles = this.handleRecordFiles.bind(this);
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
				imageData: null,
				imageResult: this.state.recordResult.substring(0, this.state.recordResult.length - 3) + content + '。',
			});
		}
	}

	sendImageRequire() {
		if (!this.state.imageFile && !this.state.imageData) return;

		this.setState({ imageResult: this.state.imageResult + '...' });

		let imageFile = new FormData();
		if (this.state.imageFile) imageFile.append('image', this.state.imageFile.fileList[0]);
		else {
			imageFile.append('image', this.state.imageData);
		}

		Controller.imageToWord(imageFile).then((response) => {
			console.log(response.data);
			this.changeResult('image', response.data);
		});
	}

	sendRecordRequire() {
		if (!this.state.recordFile) return;

		this.setState({ recordResult: this.state.recordResult + '...' });

		let voiceFile = new FormData();
		voiceFile.append('voice', this.state.recordFile.fileList[0]);

		Controller.voiceToWord(voiceFile).then((response) => {
			this.changeResult('record', response.data);
		});
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
					camera: false,
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

	handleImageData(data) {
		this.setState({
			imageData: this.dataURItoBlob(data),
		});
	}

	handleImageFiles = (file) => {
		this.setState({
			imageFile: file,
		});
	};

	handleRecordFiles = (file) => {
		this.setState({
			recordFile: file,
		});
	};

	dataURItoBlob(dataURI) {
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

	render() {
		return (
			<>
				<div className="recogBtnBlock">
					<div className="clickRecogBtn" style={this.state.recordDisplay ? { backgroundColor: '#8c8c8c', borderColor: '#8c8c8c' } : {}}>
						<img alt="record" src={require('../../../../assets/record3.png')} onClick={() => this.blockShow('record')} className="recogImg" />
					</div>
				</div>

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
						<tbody>
							<tr>
								<td className="fileBtnCenter">
									<ReactFileReader fileTypes={['.wav']} base64={true} multipleFiles={false} handleFiles={this.handleRecordFiles}>
										<div>
											{this.state.recordFile === null ? (
												<>
													<img src={require('../../../../assets/record2.png')} alt="recordPic" className="fileImg2" />
													<div className="fileText">上傳音檔</div>
												</>
											) : (
												<>
													<img src={require('../../../../assets/record2.png')} alt="recordPic" className="fileImg2" />
													<div className="fileText colorShake">{this.state.recordFile?.fileList[0].name}</div>
												</>
											)}
										</div>
									</ReactFileReader>
								</td>
								<td className="textResult">
									<img
										src={require('../../../../assets/transfromBtn.png')}
										alt="transfromBtn"
										className="transfromBtn"
										style={this.state.recordFile !== null ? { animation: 'shake 2s infinite' } : {}}
										onClick={this.sendRecordRequire.bind(this)}
									/>
									<ContentEditable
										id="recordResult"
										className="resultSpace"
										html={this.state.recordResult}
										onChange={(event) => this.handleChange(event, 'record')}
									/>

									<button onClick={() => this.copyResult('record')} className={this.state.recordCopyStatus ? 'afterClick' : 'copyBtn'}>
										{this.state.recordCopyStatus ? 'copied' : 'copy'}
									</button>
									<button className="copyBtn">
										<i
											className="fa-solid fa-trash-can"
											onClick={() => {
												this.setState({ recordResult: '' });
											}}
										></i>
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
