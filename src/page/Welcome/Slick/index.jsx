import React, { Component } from 'react';
import { Progress } from 'antd';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timer: 5,
		};
		this.introImg = ['quickNote.png', 'dragToNote.png', 'drawingBoard.png', 'OCR.png', 'recordToWord.png', 'keywordSearch.png', 'themeSwitch.png'];
		this.interval = '';

		this.nextPic = this.nextPic.bind(this);
		this.prevPic = this.prevPic.bind(this);
	}

	// componentDidUpdate() {
	// 	clearInterval(this.interval);

	// 	this.createInterval();
	// }

	componentDidMount() {
		this.createInterval();
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	createInterval() {
		this.setState({ timer: 100 });
		this.interval = setInterval(() => {
			this.setState({ timer: this.state.timer - 1 }, () => {
				if (this.state.timer === 0) {
					this.props.changeIntroIndex((this.props.introIndex + 1) % this.introImg.length);
					this.setState({ timer: 100 });
				}
			});
		}, 50);
	}

	nextPic() {
		this.props.changeIntroIndex((this.props.introIndex + 1) % this.introImg.length);
	}

	prevPic() {
		this.props.changeIntroIndex(this.props.introIndex - 1 === -1 ? this.introImg.length - 1 : this.props.introIndex - 1);
	}

	render() {
		const progressStyle = {
			width: '70%',
			position: 'abosulte',
			top: '-9px',
			left: '167px',
			zIndex: 2,
		};

		return (
			<>
				<Carousel
					id={this.props.style.current.slickDiv}
					variant="dark"
					fade
					slide={true}
					indicators={false}
					activeIndex={this.props.introIndex}
					nextIcon={
						<span
							aria-hidden="false"
							className="carousel-control-next-icon"
							style={{
								backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23009be1' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E")`,
							}}
							onClick={this.nextPic}
						/>
					}
					prevIcon={
						<span
							aria-hidden="false"
							className="carousel-control-prev-icon"
							style={{
								backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23009be1' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E")`,
							}}
							onClick={this.prevPic}
						/>
					}
				>
		
					{this.introImg.map((imgPath) => {
						return (
							<Carousel.Item key={imgPath}>
								<img draggable={false} src={require('../../../assets/' + imgPath)} alt={imgPath} className={this.props.style.current.slick} />
							</Carousel.Item>
						);
					})}			<>
					<Progress percent={100 - this.state.timer} status="active" showInfo={false} strokeColor="gray" style={progressStyle} />
				</>
				</Carousel>
			</>
		);
	}
}
