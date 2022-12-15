import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faIdCard, faLeftLong, faCircleQuestion, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { Button, CloseButton, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './index.scss';

import styled from 'styled-components';

import Controller from '../../../../tools/Controller';
import UserData from '../../../../tools/UserData';

const DivBlock = styled.div`
	color: ${(props) => (props.isDark ? '#dee2e6' : '#612500')};
	background-color: ${(props) => (props.isDark ? '#00474f' : '#ffe7ba')};
`;
const Title = styled.h3`
	color: ${(props) => (props.isDark ? '#dee2e6' : '#612500')};
`;

const Login = (props) => {
	const navigation = useNavigate();

	return <Index {...props} navigation={navigation} />;
};
export default Login;

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			props: props,
			isShowRegisterPassWord: false,
			isShowPassWord: false,
			isFindPassword: false,
		};

		this.emailRef = React.createRef();
		this.passwordRef = React.createRef();

		this.registerNameRef = React.createRef();
		this.registerEmailRef = React.createRef();
		this.registerPasswordRef = React.createRef();

		this.checkedEmailRef = React.createRef();

		this.register = this.register.bind(this);
		this.login = this.login.bind(this);
		this.findAccount = this.findAccount.bind(this);
	}

	findAccount(event) {
		event.preventDefault();
		Controller.findAccount(this.checkedEmailRef.current.value).then((response) => {
			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: '登入成功',
					text: `${response.data.name}您好，請檢查郵件`,
					showConfirmButton: false,
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: '登入失敗',
					text: '帳號或密碼有誤，請重新登入',
				});
			}
		});
	}

	register(event) {
		event.preventDefault();

		Controller.register(this.registerNameRef.current.value, this.registerEmailRef.current.value, this.registerPasswordRef.current.value);
	}

	login(event) {
		event.preventDefault();

		Controller.login(this.emailRef.current.value, this.passwordRef.current.value).then((response) => {
			if (response && response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: '成功',
					text: `${response.data.name}您好，即將為您重新轉跳`,
					showConfirmButton: false,
					timer: 1500,
				}).then(() => {
					this.props.navigation('/MainPage');
				});
			}
		});
	}

	render() {
		return (
			<Modal
				className="loginBlock"
				show={this.props.show}
				onHide={this.props.onHide}
				size=""
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<DivBlock
					isDark={UserData.darkTheme}
					style={{
						display: this.props.loginCondition && !this.state.isFindPassword ? 'block' : 'none',
					}}
				>
					<Modal.Header>
						<CloseButton variant={UserData.darkTheme ? 'white' : undefined} onClick={this.props.onHide} />
					</Modal.Header>
					<Modal.Body>
						<div className="Auth-form-container">
							<form className="Auth-form">
								<div className="Auth-form-content">
									<Title isDark={UserData.darkTheme} className="Auth-form-title text-center">
										<FontAwesomeIcon icon={faRightToBracket} /> 登入
									</Title>
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
											name="loginAccount"
											placeholder="Enter email"
											ref={this.emailRef}
											defaultValue="root@gmail.com"
											required
										/>
									</div>
									<div className="form-group mt-3">
										<label>密碼</label>
										<input
											type={this.state.isShowPassWord ? 'text' : 'password'}
											className="form-control mt-1"
											name="loginPassword"
											placeholder="Enter password"
											ref={this.passwordRef}
											defaultValue="12345678"
											required
										/>
									</div>
									<FontAwesomeIcon
										className="checkEye cursorPointer"
										icon={this.state.isShowPassWord ? faEyeSlash : faEye}
										onClick={() => {
											this.setState({
												isShowPassWord: !this.state.isShowPassWord,
											});
										}}
									/>
									<div className="d-grid gap-2 mt-3">
										<Button onClick={this.login}>提交</Button>
									</div>
									<p className="text-center mt-2">
										忘記{' '}
										<span className="link-primary cursorPointer" onClick={() => this.setState({ isFindPassword: true })}>
											密碼?
										</span>
									</p>
								</div>
							</form>
						</div>
					</Modal.Body>
					{/* <Modal.Footer>
						<Button onClick={this.props.onHide}>關閉</Button>
					</Modal.Footer> */}
				</DivBlock>

				<DivBlock
					isDark={UserData.darkTheme}
					style={{
						display: !this.props.loginCondition && !this.state.isFindPassword ? 'block' : 'none',
					}}
				>
					<Modal.Header>
						<CloseButton variant={UserData.darkTheme ? 'white' : undefined} onClick={this.props.onHide} />
					</Modal.Header>
					<Modal.Body>
						<div className="Auth-form-container">
							<form className="Auth-form">
								<div className="Auth-form-content">
									<Title isDark={UserData.darkTheme} className="Auth-form-title text-center">
										<FontAwesomeIcon icon={faIdCard} /> 註冊
									</Title>
									<div className="text-center">
										已經註冊?{' '}
										<span className="link-primary cursorPointer" onClick={() => this.props.changeLoginMode(true)}>
											登入
										</span>
									</div>
									<div className="form-group mt-3">
										<label>使用者名稱</label>
										<input type="text" className="form-control mt-1" placeholder="name" ref={this.registerNameRef} required defaultValue="JJ" />
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
											type={this.state.isShowRegisterPassWord ? 'text' : 'password'}
											className="form-control mt-1"
											placeholder="Password"
											ref={this.registerPasswordRef}
											required
											defaultValue="12345678"
										/>
									</div>
									<FontAwesomeIcon
										className="checkEye cursorPointer"
										style={{ bottom: '27.5%' }}
										icon={this.state.isShowRegisterPassWord ? faEyeSlash : faEye}
										onClick={() => {
											this.setState({
												isShowRegisterPassWord: !this.state.isShowRegisterPassWord,
											});
										}}
									/>
									<div className="d-grid gap-2 mt-3">
										<Button onClick={this.register}>註冊</Button>
									</div>
									<p className="text-center mt-2">
										忘記{' '}
										<span className="link-primary cursorPointer" onClick={() => this.setState({ isFindPassword: true })}>
											密碼?
										</span>
									</p>
								</div>
							</form>
						</div>
					</Modal.Body>
					{/* <Modal.Footer>
						<Button onClick={this.props.onHide}>關閉</Button>
					</Modal.Footer> */}
				</DivBlock>

				<DivBlock isDark={UserData.darkTheme} style={{ display: this.state.isFindPassword ? 'block' : 'none' }}>
					<Modal.Header>
						<CloseButton variant={UserData.darkTheme ? 'white' : undefined} onClick={this.props.onHide} />
					</Modal.Header>
					<Modal.Body>
						<div className="Auth-form-container">
							<form className="Auth-form">
								<div className="Auth-form-content">
									<Title isDark={UserData.darkTheme} className="Auth-form-title text-center">
										<FontAwesomeIcon icon={faCircleQuestion} /> 忘記密碼
									</Title>
									<p className="text-center mt-2">
										<span className="link-primary cursorPointer" onClick={() => this.setState({ isFindPassword: false })}>
											<FontAwesomeIcon icon={faLeftLong} /> 返回登入
										</span>
									</p>
									<div className="form-group mt-3">
										<label>電子郵件</label>
										<input
											type="email"
											className="form-control mt-1"
											placeholder="Email Address"
											ref={this.checkedEmailRef}
											required
											defaultValue="root@gmail.com"
										/>
									</div>
									<div className="d-grid gap-2 mt-3">
										<Button onClick={this.findAccount}>發送郵件</Button>
									</div>
								</div>
							</form>
						</div>
					</Modal.Body>
					{/* <Modal.Footer>
						<Button onClick={this.props.onHide}>關閉</Button>
					</Modal.Footer> */}
				</DivBlock>
			</Modal>
		);
	}
}
