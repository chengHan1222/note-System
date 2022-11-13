import axios from 'axios';
import Swal from 'sweetalert2';

// axios.defaults.timeout = 3000;
// axios.defaults.retryDelay = 3000;
// test ===================================================
// axios.defaults.withCredentials = true

export default class Controller {
	static http = 'http://127.0.0.1:5000';
	static userToken = '';

	static async findAccount(email) {
		let response = await axios.post(`${this.http}/findAccount`, { email }).catch((error) => {
			console.log(error);
		});
		return response;
	}

	static register(name, email, password) {
		let defaultData = JSON.stringify([
			{
				title: 'welcome',
				key: 'welcome',
				isLeaf: true,
				data: `["<h1>Welcome to Note System</h1>"]`,
			}
		]);
		axios
			.post(`${this.http}/register`, { name, email, password, defaultData })
			.then((request) => {
				if (request.status === 200) {
					Swal.fire({
						icon: 'success',
						title: '成功',
						text: `註冊成功`,
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	static async login(email, password) {
		let response = await axios.post(`${this.http}/login`, { email, password }, { timeout: 3000 }).catch((error) => {
			if (error.message === 'timeout of 3000ms exceeded') {
				Swal.fire({
					icon: 'error',
					title: '失敗',
					text: '超時，請確認您的帳號密碼',
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: '失敗',
					text: '登入失敗，帳號或密碼有誤，請重新登入',
				});
			}
		});

		if (response !== undefined) {
			window.localStorage.setItem('token', response.data.token);
		}
		return response;
	}

	static checkToken() {
		let token = window.localStorage.getItem('token');
		if (token !== undefined && token !== null) return axios.post(`${this.http}/check_token`, { token });
		return new Promise(() => {});
	}

	static async imageToWord(imageFile) {
		return await axios.post(`${this.http}/image`, imageFile).catch((error) => {
			console.log(error);
			return '無法辨識';
		});
	}

	static async voiceToWord(voiceFile) {
		return await axios.post(`${this.http}/voice`, voiceFile).catch((error) => {
			console.log(error);
			return '無法辨識';
		});
	}
}
