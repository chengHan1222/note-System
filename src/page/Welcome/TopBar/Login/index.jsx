import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'


export default class index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            props: props,

        }
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
                <div style={{ display: (this.props.loginCondition) ? "block" : 'none' }}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="Auth-form-container">
                            <form className="Auth-form">
                                <div className="Auth-form-content">
                                    <h3 className="Auth-form-title text-center">登入</h3>
                                    <div className="text-center">
                                        尚未註冊?{" "}
                                        <span className="link-primary" onClick={() => this.props.changeLoginMode(false)}>
                                            註冊
                                        </span>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>電子郵件</label>
                                        <input
                                            type="email"
                                            className="form-control mt-1"
                                            placeholder="Enter email"
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>密碼</label>
                                        <input
                                            type="password"
                                            className="form-control mt-1"
                                            placeholder="Enter password"
                                        />
                                    </div>
                                    <div className="d-grid gap-2 mt-3">
                                        <button type="submit" className="btn btn-primary">
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

                <div style={{ display: (!this.props.loginCondition) ? "block" : 'none' }}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="Auth-form-container">
                            <form className="Auth-form">
                                <div className="Auth-form-content">
                                    <h3 className="Auth-form-title text-center">註冊</h3>
                                    <div className="text-center">
                                        已經註冊?{" "}
                                        <span className="link-primary" onClick={() => this.props.changeLoginMode(true)}>
                                            登入
                                        </span>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>使用者名稱</label>
                                        <input
                                            type="email"
                                            className="form-control mt-1"
                                            placeholder="王俊傑"
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>電子郵件</label>
                                        <input
                                            type="email"
                                            className="form-control mt-1"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>密碼</label>
                                        <input
                                            type="password"
                                            className="form-control mt-1"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <div className="d-grid gap-2 mt-3">
                                        <button type="submit" className="btn btn-primary">
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



        )
    }
}