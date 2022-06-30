import React, { Component } from 'react'
import Recorder from 'js-audio-recorder';

export default class extends Component {

    constructor(props) {
        super(props)

        this.recorder = new Recorder();

        this.startRecord = this.startRecord.bind(this);
        this.stopRecord = this.stopRecord.bind(this);
        this.playRecrod = this.playRecrod.bind(this);
        this.downloadRecord = this.downloadRecord.bind(this);
    }
    render() {
        return (
            <div>
                <button onClick={this.startRecord}>Start</button>
                <button onClick={this.stopRecord}>Stop</button>
                <button onClick={this.playRecrod}>Play</button>
                <button onClick={this.downloadRecord}>Download</button>
            </div>
        )
    }

    startRecord() {
        this.recorder.start();
    }

    stopRecord() {
        this.recorder.stop();
    }

    playRecrod() {
        this.recorder.play();
    }

    downloadRecord() {
        console.log(this.recorder)
    }
}
