import React, { Component } from 'react';
import Recorder from 'js-audio-recorder';
import style from './index.module.scss';
import axios from 'axios';

export default class extends Component {
	constructor(props) {
		super(props);

		this.changeResult = props.changeResult;

		this.state = {
			isRecording: false,
		};

		this.recorder = new Recorder();

		this.startRecord = this.startRecord.bind(this);
		this.stopRecord = this.stopRecord.bind(this);
		this.playRecrod = this.playRecrod.bind(this);
		this.translate = this.translate.bind(this);
	}

	handleClick(event) {
		if (!this.state.isRecording) {
			this.startRecord(event);
		} else {
			this.stopRecord(event);
			this.translate(event);
		}

		this.setState({ isRecording: !this.state.isRecording });
	}

	startRecord(event) {
		event.stopPropagation();
		console.log(this.recorder);
		this.recorder.start().then(
			() => {
				this.setState({ isRecording: true });
			},
			(error) => {
				alert(`${error.name} : ${error.message}`);
			}
		);
	}

	stopRecord(event) {
		event.stopPropagation();

		this.recorder.stop();
		this.recorder.stopPlay();
		this.setState({ isRecording: false });
	}

	playRecrod(event) {
		// this.recorder.play();

		console.log(this.recorder.getPlayTime());
	}

	translate(event) {
		event.stopPropagation();

		let voiceFile = new FormData();
		voiceFile.append('voice', this.recorder.getWAVBlob());
		axios
			.post('http://127.0.0.1:5000/voice', voiceFile)
			.then((response) => {
				this.changeResult('record', response.data);
			})
			.catch((error) => console.log(error));
	}

	showRecordIcon() {
		if (!this.state.isRecording) {
			return <i className="fa-solid fa-microphone fa-2x"></i>;
		} else {
			return <i className="fa-sharp fa-solid fa-circle-stop fa-2x"></i>;
		}
	}

	render() {
		return (
			<>
				<hr />
				<div className={style.recording}>
					{/* <div className={style.onRecord} style={{ display: this.state.isRecording ? 'block' : 'none' }}></div> */}
					{/* <button onClick={this.startRecord}>▶ Start</button>
				<button onClick={this.stopRecord}>■ Stop</button>
				<button onClick={this.playRecrod}>Play</button>
				<button onClick={this.translate}>translate</button> */}
					<div
						className={this.state.isRecording ? style.recordingBtn : style.recordBtn}
						onClick={(event) => this.handleClick(event)}
					>
						{this.showRecordIcon()}
					</div>
					<div className={style.text} style={{ display: this.state.isRecording ? 'none' : '' }}>
						點我開始錄音...
					</div>
					{/* <div
					className={style.recordBtn}
					style={this.state.isRecording ? { width: '120px', transform: '' } : {}}
					onClick={() => this.setState({ isRecording: !this.state.isRecording })}
				>
					<i className="fa-solid fa-microphone fa-2x"></i>
				</div> */}
					{/* <div class="record-timer">00:00</div>
				<div class="processing-info">
					<div class="processing-info-inner"> </div>
					<div class="processing-text">
						<span class="the-text">正在處理...</span>
					</div>
				</div> */}
				</div>
			</>
		);
	}
}
