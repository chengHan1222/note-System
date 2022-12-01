import React, { Component } from 'react';
// import style from '../light.module.scss'
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserData from '../../../tools/UserData';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.interval = '';

		this.ref = React.createRef();

		this.nextPic = this.nextPic.bind(this);
		this.prevPic = this.prevPic.bind(this);
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.props.changeIntroIndex((this.props.introIndex + 1) % this.ref.current.element.childElementCount);
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	nextPic() {
		this.props.changeIntroIndex((this.props.introIndex + 1) % this.ref.current.element.childElementCount);
	}

	prevPic() {
		this.props.changeIntroIndex(this.props.introIndex - 1 === -1 ? this.ref.current.element.childElementCount - 1 : this.props.introIndex - 1);
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
				ref={this.ref}
				variant="dark"
				fade
				slide={true}
				activeIndex={this.props.introIndex}
				nextIcon={
					<span
						aria-hidden="false"
						className="carousel-control-next-icon"
						style={{
							backgroundImage: UserData.darkTheme
								? `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23009be1' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E")`
								: '',
						}}
						onClick={this.nextPic}
					/>
				}
				prevIcon={
					<span
						aria-hidden="false"
						className="carousel-control-prev-icon"
						style={{
							backgroundImage: UserData.darkTheme
								? `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23009be1' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E")`
								: '',
						}}
						onClick={this.prevPic}
					/>
				}
			>
				<Carousel.Item>
					<img src={require('../../../assets/introduction/OCR.png')} alt="" className={this.props.style.current.slick} />
				</Carousel.Item>
				<Carousel.Item>
					<img src={require('../../../assets/55570.jpg')} alt="" className={this.props.style.current.slick} />
				</Carousel.Item>
				<Carousel.Item>
					<img src={require('../../../assets/Spider-Man-Pointing-Meme.jpg')} alt="" className={this.props.style.current.slick} />
				</Carousel.Item>
				<Carousel.Item>
					<img src={require('../../../assets/venom.jpg')} alt="" className={this.props.style.current.slick} />
				</Carousel.Item>
			</Carousel>
		);
	}
}
