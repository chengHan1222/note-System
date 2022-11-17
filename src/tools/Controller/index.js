import axios from 'axios';
import Swal from 'sweetalert2';

// axios.defaults.timeout = 3000;
// axios.defaults.retryDelay = 3000;

export default class Controller {
	static http = 'http://127.0.0.1:5000';
	static userToken = '';

	static resetPassword(email, password) {
		let response = axios.post(`${Controller.http}/resetPassword`, { email, password }).catch((error) => {
			console.log(error);
		});
		return response;
	}

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
				data: `[{"strHtml":"<h1>Welcome to Note System</h1>"}]`,
			},
		]);
		axios
			.post(`${this.http}/register`, { name, email, password, defaultData })
			.then((request) => {
				if (request.status === 200) {
					Swal.fire({
						icon: 'success',
						title: '成功',
						text: `註冊成功`,
						showConfirmButton: false,
						timer: 1500,
					});
				}
			})
			.catch((error) => {
				Swal.fire({
					icon: 'error',
					title: '失敗',
					text: error.response.data,
				});
			});
	}

	static async login(email, password) {
		let response = await axios.post(`${Controller.http}/login`, { email, password }, { timeout: 3000 }).catch((error) => {
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
			// window.localStorage.setItem('token', response.data.token);
			const d = new Date();
			d.setTime(d.getTime() + 1000 * 60 * 60 * 2);
			document.cookie = `token=${response.data.token};expires=${d.toUTCString()}`;
		}
		return response;
	}

	static updateDB(file) {
		axios.post(`${this.http}/updateDB`, { file });
	}

	static logout() {
		document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
		// window.localStorage.removeItem('token');
	}

	static checkToken() {
		let token = this.#getCookie('token');
		if (token !== '') {
			return axios.post(`${this.http}/check_token`, { token });
		} else {
			return new Promise((resolve) => {
				resolve('no token');
			});
		}

		// let token = window.localStorage.getItem('token');
		// if (token !== undefined && token !== null) return axios.post(`${this.http}/check_token`, { token });
		// return new Promise((resolve) => {
		// 	resolve('no token');
		// });
	}
	static #getCookie(cname) {
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
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
