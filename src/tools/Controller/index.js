import axios from 'axios';

export default class Controller {
	static http = 'http://192.168.0.100:5000';
	static userToken = '';
	static userData = '';

	static async register(name, email, password) {
		return await axios.post(`${Controller.http}/register`, { name, email, password });
	}

	static async login(email, password) {
		let response = await axios.post(`${Controller.http}/login`, { email, password });

		Controller.userToken = response.data.access_token;
		Controller.userData = response.data.data;
		
		return response;
	}

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

	static updateDB(name, data) {
		axios
			.post(`${Controller.http}/updateDB`, { name, data })
			.then((request) => {
				console.log(request);
			})
			.catch((error) => {
				console.log(error);
			});
	}
}
