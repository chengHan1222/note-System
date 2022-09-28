import axios from 'axios';
import Swal from 'sweetalert2';

export default class Controller {
	static http = 'http://127.0.0.1:5000';
	static userToken = '';

	static register(name, email, password) {
		axios
			.post(`${Controller.http}/register`, { name, email, password })
			.then((request) => {
				console.log(request);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	static login(email, password) {
		axios
			.post(`${Controller.http}/login`, { email, password })
			.then((response) => {
				Controller.userToken = response.data.access_token;

				if (response.status === 200) {
					Swal.fire({
						icon: 'success',
						title: '成功',
						text: `${response.data.name}您好，即將為您重新轉跳`,
						showConfirmButton: false,
						timer: 1500,
					}).then(function () {
						window.location.href = '/MainPage';
					});
				} else {
					Swal.fire({
						icon: 'error',
						title: '失敗',
						text: '登入失敗，帳號或密碼有誤，請重新登入',
					});
				}
			})
			.catch(() => {
				Swal.fire({
					icon: 'error',
					title: '失敗',
					text: '登入失敗，帳號或密碼有誤，請重新登入',
				});
			});
	}

	static imageToWord(imageFile) {
		console.log('he;p')
		axios
			.post('http://127.0.0.1:5000/image', imageFile)
			.then((response) => {
				console.log(response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error);
				return '無法辨識';
			});
	}

	static voiceToWord(voiceFile) {
		axios
			.post(`${Controller.http}/voice`, voiceFile)
			.then((response) => {
				console.log(response);

				return response.data;
			})
			.catch((error) => {
				console.log(error);
				return '無法辨識';
			});
	}
}
