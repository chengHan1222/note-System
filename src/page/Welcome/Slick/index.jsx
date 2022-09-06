import React, { Component } from 'react';
import './index.css';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
		};
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.setState({index: (this.state.index+1)%3})
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval)
	}

	click(event) {
		clearInterval(this.interval)
		let target = event.target.id.split("block")[1];
		this.setState({
			index: Number(target),
		})
		this.interval = setInterval(() => {
			this.setState({index: (this.state.index+1)%3})
		}, 5000);
	}
	
	render() {
		return (
			<>
				<div className='visualblock'>
					<div id='block0' className='block' onClick={this.click.bind(this)}>1</div>
					<div id='block1' className='block' onClick={this.click.bind(this)}>2</div>
					<div id='block2' className='block' onClick={this.click.bind(this)}>3</div>
				</div>

				<Carousel 
					activeIndex={this.state.index}
					controls={false}
					indicators={false}
					id="slickDiv"
					variant="dark"
					slide={true}>
					<Carousel.Item>
						<div className='content'>1</div>
					</Carousel.Item>
					<Carousel.Item>
						<div className='content'>2</div>
					</Carousel.Item>
					<Carousel.Item>	
						<div className='content'>3</div>
					</Carousel.Item>
				</Carousel>
			</>
		);
	}
}
