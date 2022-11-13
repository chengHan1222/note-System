import axios from 'axios';
import Swal from 'sweetalert2';

// axios.defaults.timeout = 3000;
// axios.defaults.retryDelay = 3000;

export default class Controller {
	static http = 'http://127.0.0.1:5000';
	static userToken = '';

	static resetPassword(email, password) {
		let response = axios.post(`${Controller.http}/resetPassword`, { email, password })
			.catch((error) => {
				console.log(error)
			})
		return response;
	}

	static async findAccount(email) {
		let response = await axios.post(`${Controller.http}/findAccount`, { email }).catch((error) => {
			console.log(error);
		});
		return response;
	}

	static async register(name, email, password) {
		return await axios.post(`${Controller.http}/register`, { name, email, password }).catch((error) => {
				console.log(error);
			});
	}

	static async login(email, password) {
		let response = await axios.post(`${Controller.http}/login`, { email, password }).catch((error) => {
			// if (error.message === 'timeout of 3000ms exceeded') {
			// 	Swal.fire({
			// 		icon: 'error',
			// 		title: '失敗',
			// 		text: '超時，請確認您的帳號密碼',
			// 	});
			// } else {
			Swal.fire({
				icon: 'error',
				title: '失敗',
				text: '登入失敗，帳號或密碼有誤，請重新登入',
			});
			// }
		});

		if (response !== undefined) Controller.userToken = response.data.access_token;
		// console.log(this.#resolveToken(Controller.userToken));
		// let list = Controller.userToken.split('.');
		// list.forEach(element => {
		// 	console.log(element.)
		// })
		return response;
	}
	// #resolveToken(token) {
	// 	const { secret } = tokenBaseInfo;
	// 	return new Promise((resolve, reject) => {
	// 		JWT.verify(token, secret, (error, data) => {
	// 			error ? reject(error) : resolve(data);
	// 		});
	// 	});
	// }

	static async imageToWord(imageFile) {
		return await axios.post(`${Controller.http}/image`, imageFile).catch((error) => {
			console.log(error);
			return '無法辨識';
		});
	}

	static async voiceToWord(voiceFile) {
		return await axios.post(`${Controller.http}/voice`, voiceFile).catch((error) => {
			console.log(error);
			return '無法辨識';
		});
	}
}
