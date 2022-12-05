import React, { Component } from 'react';
import { Switch } from 'antd';
import Login from './Login';

import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import useRWD from '../../../tools/useRWD';
import UserData from '../../../tools/UserData';

const TopBar = (props) => {
	const windowWidth = useRWD();

	return <Index {...props} windowWidth={windowWidth} />;
};

export default TopBar;

class Index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalShow: false,
			loginCondition: true,
			isRunning: false,
		};

		this.setModalShow = this.setModalShow.bind(this);
		this.changeLoginMode = this.changeLoginMode.bind(this);
	}

	setModalShow(input) {
		if (!input) {
			this.setState({ modalShow: input, loginCondition: true });
		} else {
			this.setState({ modalShow: input });
		}
	}

	changeLoginMode(input) {
		this.setState({ loginCondition: input });
	}

	render() {
		return (
			<div className={this.props.style.current.topBar}>
				<button className={this.props.style.current.logo}>
					<img
						className={this.props.style.current.logo_icon}
						src={!UserData.darkTheme ? require('../../../assets/logo_Darkbrown_white.png') : require('../../../assets/logo_blueGreen.png')}
						alt="Logo"
					></img>
					<div className={this.props.style.current.logo_word} style={{ visibility: this.props.windowWidth >= 630 ? 'visible' : 'hidden' }}>
						SIMPLE NOTE
					</div>
				</button>

				<div className={this.props.style.current.introContainer}>
					<DropdownButton
						title="介紹"
						id={this.props.style.current.intro1}
						style={{ visibility: this.props.windowWidth >= 730 ? 'visible' : 'hidden' }}
					>
						<Dropdown.Item
							id={this.props.style.current.introDiv}
							as="div"
							onClick={() => {
								this.props.changeIntroIndex(0);
							}}
						>
							輕鬆使用
						</Dropdown.Item>
						<Dropdown.Item
							id={this.props.style.current.introDiv}
							as="div"
							onClick={() => {
								this.props.changeIntroIndex(1);
							}}
						>
							拖曳式筆記
						</Dropdown.Item>
					</DropdownButton>

					<DropdownButton
						title="功能"
						id={this.props.style.current.intro2}
						style={{ visibility: this.props.windowWidth >= 830 ? 'visible' : 'hidden' }}
					>
						<Dropdown.Item
							id={this.props.style.current.introDiv}
							as="button"
							onClick={() => {
								this.props.changeIntroIndex(2);
							}}
						>
							繪圖板
						</Dropdown.Item>
						<Dropdown.Item
							id={this.props.style.current.introDiv}
							as="button"
							onClick={() => {
								this.props.changeIntroIndex(3);
							}}
						>
							智能掃描文字
						</Dropdown.Item>
						<Dropdown.Item
							id={this.props.style.current.introDiv}
							as="button"
							onClick={() => {
								this.props.changeIntroIndex(4);
							}}
						>
							語音辨識功能
						</Dropdown.Item>
						<Dropdown.Item
							id={this.props.style.current.introDiv}
							as="button"
							onClick={() => {
								this.props.changeIntroIndex(5);
							}}
						>
							關鍵字搜尋
						</Dropdown.Item>
						<Dropdown.Item
							id={this.props.style.current.introDiv}
							as="button"
							onClick={() => {
								this.props.changeIntroIndex(6);
							}}
						>
							主題切換
						</Dropdown.Item>
					</DropdownButton>

					<DropdownButton
						title="團隊"
						id={this.props.style.current.intro3}
						style={{ visibility: this.props.windowWidth >= 930 ? 'visible' : 'hidden' }}
					>
						<Dropdown.Item id={this.props.style.current.introDiv} as="div">
							Dmyeh
						</Dropdown.Item>
						<Dropdown.Divider style={{ margin: 0, backgroundColor: '#fafafa' }} />
						<Dropdown.Item id={this.props.style.current.introDiv} as="div">
							Mark
						</Dropdown.Item>
						<Dropdown.Item id={this.props.style.current.introDiv} as="div">
							Han
						</Dropdown.Item>
						<Dropdown.Item id={this.props.style.current.introDiv} as="div">
							Alen
						</Dropdown.Item>
					</DropdownButton>
				</div>

				<div className={this.props.style.current.contactDiv}>
					<Switch
						defaultChecked={UserData.darkTheme}
						loading={this.state.isRunning ? true : false}
						style={{
							backgroundColor: this.props.darkBtn ? '#006d75' : '#fa8c16',
							fontWeight: 'bold',
						}}
						checkedChildren="DARK"
						unCheckedChildren="LIGHT"
						onChange={(check) => {
							this.props.setDarkTheme(check);
							this.setState({ isRunning: true });
							setTimeout(() => this.setState({ isRunning: false }), 3000);
						}}
					/>

					<Button className={this.props.style.current.contact} style={{ display: this.props.windowWidth >= 1050 ? 'block' : 'none' }}>
						聯絡我們
					</Button>
					<Button id={this.props.style.current.start} name="loginButton" onClick={() => this.setModalShow(true)}>
						開始體驗
					</Button>
					<Login
						show={this.state.modalShow}
						loginCondition={this.state.loginCondition}
						changeLoginMode={this.changeLoginMode}
						onHide={() => this.setModalShow(false)}
					></Login>
				</div>
			</div>
		);
	}
}
