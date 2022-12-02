import React, { Component } from 'react';
// import style from '../light.module.scss'
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserData from '../../../tools/UserData';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.introImg = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png'];
		this.interval = '';

		this.nextPic = this.nextPic.bind(this);
		this.prevPic = this.prevPic.bind(this);
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.props.changeIntroIndex((this.props.introIndex + 1) % this.introImg.length);
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	nextPic() {
		this.props.changeIntroIndex((this.props.introIndex + 1) % this.introImg.length);
	}

	prevPic() {
		this.props.changeIntroIndex(this.props.introIndex - 1 === -1 ? this.introImg.length - 1 : this.props.introIndex - 1);
	}

	// click(event) {
	// 	clearInterval(this.interval)
	// 	let target = event.target.id.split("block")[1];
	// 	this.setState({
	// 		index: Number(target),
	// 	})
	// 	this.interval = setInterval(() => {
	// 		this.setState({ index: (this.state.index + 1) % 3 })
	// 	}, 5000);
	// }

	render() {
		return (
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
							<img src={require('../../../assets/' + imgPath)} alt={imgPath} className={this.props.style.current.slick} />
						</Carousel.Item>
					);
				})}
			</Carousel>
		);
	}
}
