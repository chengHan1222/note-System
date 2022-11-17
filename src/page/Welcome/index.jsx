import React from 'react';
import style from './light.module.scss';
import darkmode from './dark.module.scss';
import Slick from './Slick';
import TopBar from './TopBar';

const { useEffect, useRef, useState } = React;

const Welcome = () => {
	const [introIndex, setIntroIndex] = useState(0);
	const [darkBtn, setDarkTheme] = useState(false)
	const css = useRef(darkBtn ? darkmode : style);

	useEffect(() => {
		css.current = darkBtn ? darkmode : style
		console.log('n')
	}, [darkBtn])

	const changeIntroIndex = (input) => {
		setIntroIndex(input)
	}

	return (<div className={css.current.mainblock}>

		<TopBar style={css} setDarkTheme={setDarkTheme} changeIntroIndex={changeIntroIndex}></TopBar>

		<Slick style={css} introIndex={introIndex} changeIntroIndex={changeIntroIndex}></Slick>

	</div>)
}

export default Welcome;

// class index extends Component {

// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			darkTheme: false,
// 			introIndex: 0,
// 		}

// 		this.changeIntroIndex = this.changeIntroIndex.bind(this);
// 	}

// 	changeIntroIndex(input) {
// 		this.setState({ introIndex: input });
// 	}

// 	render() {
// 		return (
// 			<div className={style.mainblock}>
// 				<TopBar changeIntroIndex={this.changeIntroIndex}></TopBar>

// 				<Slick introIndex={this.state.introIndex} changeIntroIndex={this.changeIntroIndex}></Slick>
// 			</div>
// 		);
// 	}
// }
