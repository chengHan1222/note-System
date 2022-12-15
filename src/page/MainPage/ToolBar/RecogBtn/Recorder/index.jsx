import React, { Component } from 'react';
import Recorder from 'js-audio-recorder';
import style from './index.module.scss';
import axios from 'axios';

export default class Index extends Component {
	constructor(props) {
		super(props);

		this.changeResult = props.changeResult;

		this.state = {
			isRecording: false,

			second: '00',
			minute: '00',
			counter: 0,
		};

		this.timer = '';
		this.recorder = new Recorder();

		this.startRecord = this.startRecord.bind(this);
		this.stopRecord = this.stopRecord.bind(this);
		this.playRecrod = this.playRecrod.bind(this);
		this.translate = this.translate.bind(this);
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
	}

	componentDidMount() {
		this.recorder.onprogress = function (params) {
			// let data = e.inputBuffer.getChannelData(0);
			console.log(params.vol);
		};
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

	start() {
		this.timer = setInterval(() => {
			const secondCounter = this.state.counter % 60;
			const minuteCounter = Math.floor(this.state.counter / 60);

			const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}` : secondCounter;
			const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}` : minuteCounter;

			this.setState({ second: computedSecond, minute: computedMinute, counter: this.state.counter + 1 });
		}, 1000);
	}
	stop() {
		clearInterval(this.timer);

		this.setState({ second: '00', minute: '00', counter: 0 });
	}

	render() {
		return (
			<>
				<hr />
				<div className={style.recording}>
					<div
						className={this.state.isRecording ? style.recordingBtn : style.recordBtn}
						onClick={(event) => {
							this.handleClick(event);
							if (!this.state.isRecording) this.start();
							else this.stop();
						}}
					>
						{this.showRecordIcon()}
					</div>
					<div className={style.text} style={{ display: this.state.isRecording ? 'none' : '' }}>
						點我開始錄音...
					</div>

					<div className={style.timer}>
						<span>{this.state.minute}</span>
						<span>:</span>
						<span>{this.state.second}</span>
					</div>
				</div>
			</>
		);
	}
}
