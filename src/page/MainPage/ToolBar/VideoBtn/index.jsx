import React from 'react';
import ReactFileReader from 'react-file-reader';
import './index.scss';
// import axios from "axios"

class videoBtn extends React.Component {
	constructor(props) {
		super(props);
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
	}

	sendVideoRequire() {
		//向後端要資料
	}

	sendRecordRequire() {
		//向後端要資料
	}

	videoCopyResult() {
		if (this.state.videoCopyStatus == false) {
			this.setState({
				videoCopyStatus: true,
			});
		}
	}

	recordCopyResult() {
		if (this.state.recordCopyStatus == false) {
			this.setState({
				recordCopyStatus: true,
			});
		}
	}

	videoShow() {
		let display = this.state.videoDisplay;
		if (display === null) display = false;

		this.setState({
			videoDisplay: !display,
			recordDisplay: false,
		});
	}

	recordShow() {
		let display = this.state.recordDisplay;
		if (display === null) display = false;

		this.setState({
			videoDisplay: false,
			recordDisplay: !display,
		});
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

	render() {
		return (
			<>
				<div className="videoBtn">
					<img
						src={require('../../../../assets/camera.png')}
						onClick={this.videoShow.bind(this)}
						className="videoImg"
					/>
					<img
						src={require('../../../../assets/record.png')}
						onClick={this.recordShow.bind(this)}
						className="videoImg"
					/>
				</div>
				<div
					className="animateBlock"
					style={
						this.state.videoDisplay === null
							? { display: 'none' }
							: { animationName: this.state.videoDisplay ? 'show' : 'close' }
					}
				>
					<table className="videoBlock">
						<tbody>
							<tr>
								<td className="videoBtnCenter">
									<ReactFileReader
										fileTypes={['.jpg', '.png', '.jpeg', '.gif']}
										base64={true}
										multipleFiles={false}
										handleFiles={this.handleVideoFiles.bind(this)}
									>
										<img src={require('../../../../assets/camera2.png')} className="videoImg2" />
										<div className="videoText">上傳圖片</div>
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
					className="animateBlock"
					style={
						this.state.recordDisplay === null
							? { display: 'none' }
							: { animationName: this.state.recordDisplay ? 'show' : 'close' }
					}
				>
					<table className="videoBlock">
						<tbody>
							<tr>
								<td className="videoBtnCenter">
									<button>錄音</button>

									<ReactFileReader
										fileTypes={['.mp3', 'wav']}
										base64={true}
										multipleFiles={false}
										handleFiles={this.handleRecordFiles.bind(this)}
									>
										<img src={require('../../../../assets/record2.png')} className="videoImg2" />
										<div className="videoText">上傳音檔</div>
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
						</tbody>
					</table>
				</div>
			</>
		);
	}
}
export default videoBtn;
