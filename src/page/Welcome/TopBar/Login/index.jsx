import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import './index.scss';

import Controller from '../../../../tools/Controller';

export default function (props) {
	const navigation = useNavigate();

	return <Index {...props} navigation={navigation} />;
}

export class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			props: props,
		};

		this.emailRef = React.createRef();
		this.passwordRef = React.createRef();

		this.registerNameRef = React.createRef();
		this.registerEmailRef = React.createRef();
		this.registerPasswordRef = React.createRef();

		this.register = this.register.bind(this);
		this.login = this.login.bind(this);
	}

	register() {
		Controller.register(
			this.registerNameRef.current.value,
			this.registerEmailRef.current.value,
			this.registerPasswordRef.current.value
		);
	}

	login(event) {
		event.preventDefault();

		Controller.login(this.emailRef.current.value, this.passwordRef.current.value).then((response) => {
			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: '成功',
					text: `${response.data.name}您好，即將為您重新轉跳`,
					showConfirmButton: false,
					timer: 1500,
				}).then(() => {
					this.props.navigation('./MainPage');
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: '失敗',
					text: '登入失敗，帳號或密碼有誤，請重新登入',
				});
			}
		});
	}

	render() {
		return (
			<Modal
				show={this.props.show}
				onHide={this.props.onHide}
				size=""
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<div style={{ display: this.props.loginCondition ? 'block' : 'none' }}>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="Auth-form-container">
							<form className="Auth-form">
								<div className="Auth-form-content">
									<h3 className="Auth-form-title text-center">登入</h3>
									<div className="text-center">
										尚未註冊?{' '}
										<span className="link-primary cursorPointer" onClick={() => this.props.changeLoginMode(false)}>
											註冊
										</span>
									</div>
									<div className="form-group mt-3">
										<label>電子郵件</label>
										<input
											type="email"
											className="form-control mt-1"
											placeholder="Enter email"
											ref={this.emailRef}
											defaultValue="root@gmail.com"
											required
										/>
									</div>
									<div className="form-group mt-3">
										<label>密碼</label>
										<input
											type="password"
											className="form-control mt-1"
											placeholder="Enter password"
											ref={this.passwordRef}
											defaultValue="12345678"
											required
										/>
									</div>
									<div className="d-grid gap-2 mt-3">
										<button className="btn btn-primary" onClick={this.login}>
											提交
										</button>
									</div>
									<p className="text-center mt-2">
										忘記 <a href="#">密碼?</a>
									</p>
								</div>
							</form>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.onHide}>關閉</Button>
					</Modal.Footer>
				</div>

				<div style={{ display: !this.props.loginCondition ? 'block' : 'none' }}>
					<Modal.Header closeButton></Modal.Header>
					<Modal.Body>
						<div className="Auth-form-container">
							<form className="Auth-form">
								<div className="Auth-form-content">
									<h3 className="Auth-form-title text-center">註冊</h3>
									<div className="text-center">
										已經註冊?{' '}
										<span className="link-primary cursorPointer" onClick={() => this.props.changeLoginMode(true)}>
											登入
										</span>
									</div>
									<div className="form-group mt-3">
										<label>使用者名稱</label>
										<input
											type="text"
											className="form-control mt-1"
											placeholder="name"
											ref={this.registerNameRef}
											required
											defaultValue="JJ"
										/>
									</div>
									<div className="form-group mt-3">
										<label>電子郵件</label>
										<input
											type="email"
											className="form-control mt-1"
											placeholder="Email Address"
											ref={this.registerEmailRef}
											required
											defaultValue="123@gmail.com"
										/>
									</div>
									<div className="form-group mt-3">
										<label>密碼</label>
										<input
											type="password"
											className="form-control mt-1"
											placeholder="Password"
											ref={this.registerPasswordRef}
											required
											defaultValue="12345678"
										/>
									</div>
									<div className="d-grid gap-2 mt-3">
										<button type="submit" className="btn btn-primary" onClick={this.register}>
											註冊
										</button>
									</div>
									<p className="text-center mt-2">
										忘記 <a href="#">密碼?</a>
									</p>
								</div>
							</form>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.onHide}>關閉</Button>
					</Modal.Footer>
				</div>
			</Modal>
		);
	}
}
