import axios from 'axios';
import Swal from 'sweetalert2';

export default class Controller {
	static http = 'http://192.168.100.49:5000';
	static userToken = '';

	static register(name, email, password) {
		axios
			.post(`${Controller.http}/register`, JSON.stringify({ name, email, password }))
			.then((request) => {
				console.log(request);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	static async login(email, password) {
		let response = await axios.post(`${Controller.http}/login`, { email, password }).catch(() => {
			Swal.fire({
				icon: 'error',
				title: '失敗',
				text: '登入失敗，帳號或密碼有誤，請重新登入',
			});
		});

		Controller.userToken = response.data.access_token;
		return response;
	}

	static async imageToWord(imageFile) {
		return await axios
			.post(`${Controller.http}/image`, imageFile)
			.catch((error) => {
				console.log(error);
				return '無法辨識';
			});
	}

	static async voiceToWord(voiceFile) {
		return await axios
			.post(`${Controller.http}/voice`, voiceFile)
			.catch((error) => {
				console.log(error);
				return '無法辨識';
			});
	}
}
