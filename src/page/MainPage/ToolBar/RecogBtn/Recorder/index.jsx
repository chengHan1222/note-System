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

	startRecord(event) {
		event.stopPropagation();
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
		event.stopPropagation();

		this.recorder.play();
		// this.recorder.downloadWAV();
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

	render() {
		return (
			<>
				<div className={style.onRecord} style={{ display: this.state.isRecording ? 'block' : 'none' }}></div>
				<button onClick={this.startRecord}>▶ Start</button>
				<button onClick={this.stopRecord}>■ Stop</button>
				<button onClick={this.playRecrod}>Play</button>
				<button onClick={this.translate}>translate</button>
			</>
		);
	}
}
