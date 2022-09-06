import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.scss';

import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

export default class index extends Component {
	render() {
		return (
			<div className={style.topBar}>
				<button className={style.logo}>
					<img className={style.logo_icon} src={require('../../../assets/note-icen.png')} alt=""></img>
					<div className={style.logo_word}>NOTE SYSTEM</div>
				</button>

				<div className={style.introContainer}>
					<DropdownButton title="介紹" id={style.intro1} menuVariant={'dark'}>
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
					<Link to="./Test">
						<Button className={style.contact}>測試</Button>
					</Link>

					<Button className={style.contact}>Contact us</Button>

					<Link to="./MainPage">
						<Button id={style.start}>Get Started</Button>
					</Link>
				</div>
			</div>
		);
	}
}
