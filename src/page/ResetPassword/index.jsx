import React from 'react'
import TopBar from './../Welcome/TopBar';
import style from './index.module.scss';
import Controller from '../../tools/Controller';

export default class ResetPassword extends React.Component{

    constructor(props) {
        super(props);
        this.state = {}

		this.registerNewPasswordRef = React.createRef();
        this.registerComfirmPasswordRef = React.createRef();
    }

    setNewPassword() {
        if (this.registerNewPasswordRef !== this.registerComfirmPasswordRef) return;
    }

    render() {
        return (
            <>
                <TopBar changeIntroIndex={() => {}}/>
                <div className={style.body}>
                    <div className="Auth-form-container">
                        <form className="Auth-form">
                            <div className="Auth-form-content">
                                <h3 className="Auth-form-title text-center">忘記密碼</h3>
                                <br/>
                                <div className="form-group mt-3">
                                    <label>新密碼</label>
                                    <input
                                        type="password"
                                        className="form-control mt-1"
                                        placeholder="new password"
                                        ref={this.registerNewPasswordRef}
                                        required
                                        defaultValue="12345678"
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label>確認密碼</label>
                                    <input
                                        type="password"
                                        className="form-control mt-1"
                                        placeholder="new password"
                                        ref={this.registerComfirmPasswordRef}
                                        required
                                        defaultValue="12345678"
                                    />
                                </div>
                                <div className="d-grid gap-2 mt-3">
                                    <button type="submit" className="btn btn-primary" onClick={this.setNewPassword}>
                                        確認
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}