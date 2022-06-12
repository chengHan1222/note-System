import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { Dropdown } from 'react-bootstrap';
import { DropdownButton } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class index extends Component {
	render() {
		return (
			<div className="topBar">
				<button className="logo">
					<img src={require('../../../assets/note-2-64x64.png')} alt=""></img>
					<div className="logo_word">NOTE SYSTEM</div>
				</button>

				<DropdownButton id="intro1" title="介紹">
					<Dropdown.Item as="button" href="#">
						輕鬆使用
					</Dropdown.Item>
					<Dropdown.Item as="button" href="#">
						隨時筆記
					</Dropdown.Item>
					<Dropdown.Item as="button" href="#">
						人性化使用者介面
					</Dropdown.Item>
				</DropdownButton>

				<DropdownButton id="intro2" title="功能">
					<Dropdown.Item as="button" href="#">
						影像辨識
					</Dropdown.Item>
					<Dropdown.Item as="button" href="#">
						語音即時記錄
					</Dropdown.Item>
					<Dropdown.Item as="button" href="#"></Dropdown.Item>
				</DropdownButton>

				<DropdownButton id="intro3" title="團隊">
					<Dropdown.Item as="button" href="#">
						Mark
					</Dropdown.Item>
					<Dropdown.Item as="button" href="#">
						Han
					</Dropdown.Item>
					<Dropdown.Item as="button" href="#">
						JJ
					</Dropdown.Item>
				</DropdownButton>

				<div id="contactDiv">
					<Button id="contact">Contact us</Button>
					
					<Link to="./MainPage" className="btnStart">
						<Button id="start">Get Started</Button>
					</Link>
				</div>
			</div>
		);
	}
}
