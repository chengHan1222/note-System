import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.scss';
import Login from './Login'

import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

export default class index extends Component {

	constructor(props) {

		super(props);

		this.state = {
			modalShow: false,
			loginCondition: true,
		};

		this.setModalShow = this.setModalShow.bind(this);
		this.changeLoginMode = this.changeLoginMode.bind(this);

	}

	setModalShow(input) {
		if (!input) {
			this.setState({ modalShow: input, loginCondition: true });
		}
		else {

			this.setState({ modalShow: input });
		}
	}

	changeLoginMode(input) {
		this.setState({ loginCondition: input });
	}

	render() {
		return (
			<div className={style.topBar}>
				<button className={style.logo}>
					<img className={style.logo_icon} src={require('../../../assets/Logo.png')} alt="Logo"></img>
					<div className={style.logo_word}>SIMPLE NOTE</div>
				</button>

				<div className={style.introContainer}>
					<DropdownButton title="介紹" id={style.intro1} menuVariant={'dark'}>
						<Dropdown.Item as="button" href="#" onClick={() => { this.props.changeIntroIndex(0) }}>
							輕鬆使用
						</Dropdown.Item>
						<Dropdown.Item as="button" href="#" onClick={() => { this.props.changeIntroIndex(1) }}>
							隨時筆記
						</Dropdown.Item>
						<Dropdown.Item as="button" href="#" onClick={() => { this.props.changeIntroIndex(2) }}>
							人性化使用者介面
						</Dropdown.Item>
					</DropdownButton>

					<DropdownButton title="功能" id={style.intro2} menuVariant={'dark'}>
						<Dropdown.Item as="button" href="#">
							影像辨識
						</Dropdown.Item>
						<Dropdown.Item as="button" href="#">
							語音即時記錄
						</Dropdown.Item>
						<Dropdown.Item as="button" href="#"></Dropdown.Item>
					</DropdownButton>

					<DropdownButton title="團隊" id={style.intro3} menuVariant={'dark'}>
						<Dropdown.Item as="div" href="#">
							Mark
						</Dropdown.Item>
						<Dropdown.Item as="div" href="#">
							Han
						</Dropdown.Item>
						<Dropdown.Item as="div" href="#">
							JJ
						</Dropdown.Item>
					</DropdownButton>
				</div>

				<div className={style.contactDiv}>
					<Link to="./MainPage">
						<Button className={style.contact}>測試</Button>
					</Link>

					<Button className={style.contact}>聯絡我們</Button>

					<Button id={style.start} name="loginButton" onClick={() => this.setModalShow(true)}>開始體驗</Button>

					<Login show={this.state.modalShow}
						loginCondition={this.state.loginCondition}
						changeLoginMode={this.changeLoginMode}
						onHide={() => this.setModalShow(false)}>
					</Login>
				</div>
			</div>
		);
	}
}
