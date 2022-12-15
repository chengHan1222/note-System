import React, { Component } from 'react';
import Recorder from 'js-audio-recorder';
import style from './index.module.scss';

import Controller from '../../../../tools/Controller';

export default class Index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isRecording: false,

			second: '00',
			minute: '00',
			counter: 0,
		};

		this.timer = '';
		// this.recognition = '';
		this.recorder = new Recorder();
		// this.recorderFinal = new Recorder();
		this.voiceResult = '';

		this.startRecord = this.startRecord.bind(this);
		this.stopRecord = this.stopRecord.bind(this);
		this.translate = this.translate.bind(this);
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
	}

	startRecord(event) {
		event.stopPropagation();

		// this.recorderFinal.start();
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

		// this.recorderFinal.stop();
		this.recorder.stop();
		this.setState({ isRecording: false });
	}

	translate(event, isEnd) {
		event.stopPropagation();

		let voiceFile = new FormData();
		if (isEnd) {
			voiceFile.append('voice', this.recorder.getWAVBlob());

			Controller.voiceToWord(voiceFile).then((response) => {
				// if (this.voiceResult === '' && response.data.text === '無法翻譯')
				// 	this.props.setRecordContent('即時錄音', response.data.text, response.data.keyword);

				// this.props.setRecordContent('即時錄音', this.voiceResult + response.data.text.replace('無法翻譯', ''), response.data.keyword);
				this.props.setRecordContent('即時錄音', response.data.text, response.data.keyword);
			});
		}
		// else {
		// 	voiceFile.append('voice', this.recorder.getWAVBlob());

		// 	this.recorder.start();
		// 	Controller.voiceToWordLive(voiceFile).then((response) => {
		// 		this.voiceResult += response.data.text;
		// 		this.props.setRecordContent('即時錄音', this.voiceResult + '...');
		// 	});
		// }
	}

	start(event) {
		this.voiceResult = '';
		this.props.setRecordContent('即時錄音', '...');

		this.timer = setInterval(() => {
			const secondCounter = this.state.counter % 60;
			const minuteCounter = Math.floor(this.state.counter / 60);
			const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}` : secondCounter;
			const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}` : minuteCounter;
			this.setState({ second: computedSecond, minute: computedMinute, counter: this.state.counter + 1 });
		}, 1000);

		// this.recognition = setInterval(() => {
		// 	this.translate(event, false);
		// }, 2000);

		this.startRecord(event);
		this.setState({ isRecording: true });
	}
	stop(event) {
		clearInterval(this.timer);
		// clearInterval(this.recognition);

		this.stopRecord(event);
		this.translate(event, true);

		this.setState({ second: '00', minute: '00', counter: 0, isRecording: false });
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
			<div className={style.recording}>
				<div
					className={this.state.isRecording ? style.recordingBtn : style.recordBtn}
					onClick={(event) => {
						if (!this.state.isRecording) this.start(event);
						else this.stop(event);
					}}
				>
					{this.showRecordIcon()}
				</div>
				<div className={style.text} style={{ display: this.state.isRecording ? 'none' : '' }}>
					點我開始錄音...
				</div>

				<div className={style.timer} style={{ display: this.state.isRecording ? 'block' : 'none' }}>
					<span>{this.state.minute}</span>
					<span>:</span>
					<span>{this.state.second}</span>
				</div>
			</div>
		);
	}
}
