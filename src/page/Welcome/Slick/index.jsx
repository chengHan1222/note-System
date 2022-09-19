import React, { Component } from 'react';
import './index.css';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
		this.interval = '';

		this.nextPic = this.nextPic.bind(this);
		this.prevPic = this.prevPic.bind(this);
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.props.changeIntroIndex((this.props.introIndex + 1) % 3);
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval)
	}

	nextPic() {
		if (this.props.introIndex === 2) {
			this.props.changeIntroIndex(0);
		}
		else {
			this.props.changeIntroIndex(this.props.introIndex + 1);
		}


	}

	prevPic() {
		if (this.props.introIndex === 0) {
			this.props.changeIntroIndex(2);
		}
		else {
			this.props.changeIntroIndex(this.props.introIndex - 1);
		}

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
			<div id="outer">
				<Carousel id="slickDiv" variant="dark" fade slide={true} activeIndex={this.props.introIndex} nextIcon={<span aria-hidden="false" className="carousel-control-next-icon" onClick={this.nextPic} />} prevIcon={<span aria-hidden="false" className="carousel-control-prev-icon" onClick={this.prevPic} />}>
					<Carousel.Item>
						<img src={require('../../../assets/55570.jpg')} alt="" class="slick" />

					</Carousel.Item>
					<Carousel.Item>
						<img src={require('../../../assets/Spider-Man-Pointing-Meme.jpg')} alt="" class="slick" />

					</Carousel.Item>
					<Carousel.Item>
						<img src={require('../../../assets/venom.jpg')} alt="" class="slick" />

					</Carousel.Item>
				</Carousel>
			</div >
			// <>
			// 	<div className='visualblock'>
			// 		<div id='block0' className='block' onClick={this.click.bind(this)}>1</div>
			// 		<div id='block1' className='block' onClick={this.click.bind(this)}>2</div>
			// 		<div id='block2' className='block' onClick={this.click.bind(this)}>3</div>
			// 	</div>

			// 	<Carousel 
			// 		activeIndex={this.state.index}
			// 		controls={false}
			// 		indicators={false}
			// 		id="slickDiv"
			// 		variant="dark"
			// 		slide={true}>
			// 		<Carousel.Item>
			// 			<div className='content'>1</div>
			// 		</Carousel.Item>
			// 		<Carousel.Item>
			// 			<div className='content'>2</div>
			// 		</Carousel.Item>
			// 		<Carousel.Item>	
			// 			<div className='content'>3</div>
			// 		</Carousel.Item>
			// 	</Carousel>
			// </>
		);
	}
}
