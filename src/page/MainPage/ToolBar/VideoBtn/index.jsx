import React from 'react';
import ReactFileReader from 'react-file-reader';
import style from'./index.scss';
// import axios from "axios"

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

		this.handleVideoFiles = this.handleVideoFiles.bind(this);
		this.handleRecordFiles = this.handleRecordFiles.bind(this);
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
		if (this.isChanging) return;

		let display = this.state.videoDisplay;
		if (display === null) display = false;

		this.isChanging = true;
		this.setState(
			{
				videoDisplay: !display,
				recordDisplay: false,
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
				videoDisplay: false,
				recordDisplay: !display,
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

	render() {
		return (
			<>
				<div className="btnBlock">
					<div className="videoBtn" style={{backgroundColor: this.state.videoDisplay ? 'rgba(87, 154, 236, 0.814)' : ''}}>
						<img
							src={require('../../../../assets/camera3.png')}
							onClick={this.videoShow.bind(this)}
							className="videoImg"
						/>
					</div>
					<div className="videoBtn" style={{backgroundColor: this.state.recordDisplay ? 'rgba(87, 154, 236, 0.814)' : ''}}>
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
					className={`animateBlock ${this.state.recordDisplay ? 'animateBlockShow' : 'animateBlockClose'}`}
					style={{ display: this.state.recordDisplay === null ? 'none' : '' }}
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
										handleFiles={this.handleRecordFiles}
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
