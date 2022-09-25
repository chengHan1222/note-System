import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './index.scss';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			props: props,
		};

		this.emailRef = React.createRef();
		this.passwordRef = React.createRef();
		this.tokenRef = React.createRef();

		this.registerNameRef = React.createRef();
		this.registerEmailRef = React.createRef();
		this.registerPasswordRef = React.createRef();

		this.register = this.register.bind(this);
		this.submit = this.submit.bind(this);
	}

	register() {
		let user = {
			name: this.registerNameRef.current.value,
			email: this.registerEmailRef.current.value,
			password: this.registerPasswordRef.current.value,
		};

		console.log(user.email);

		axios
			.post('http://127.0.0.1:5000/register', user)
			.then((request) => {
				console.log(request);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	submit() {
		let user = { email: this.emailRef.current.value, password: this.passwordRef.current.value };

		axios
			.post('http://127.0.0.1:5000/login', user)
			.then((response) => {
				console.log(response.status);

				this.tokenRef.current = response.data.access_token;
				if (response.status === 200) {
					window.location.href = '/MainPage';
				}
			})
			.catch((error) => console.log(error));
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
											defaultValue="root"
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
										<button className="btn btn-primary" onClick={this.submit}>
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
