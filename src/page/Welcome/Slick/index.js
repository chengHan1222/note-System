import React, { Component } from 'react';
import './index.css';
import { Carousel } from 'react-bootstrap';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: 1,
		};
	}

	test() {
		this.setState({ id: 2 });
	}

	render() {
		return (
			<div id="outer">
				<Carousel id="slickDiv" variant="dark">
					<Carousel.Item>
						<img src={require('../../../assets/55570.jpg')} alt="" className="slick" />
					</Carousel.Item>
					<Carousel.Item>
						<img src={require('../../../assets/Spider-Man-Pointing-Meme.jpg')} alt="" className="slick" />
					</Carousel.Item>
					<Carousel.Item>
						<img src={require('../../../assets/venom.jpg')} alt="" className="slick" />
					</Carousel.Item>
				</Carousel>
			</div>
		);
	}
}
