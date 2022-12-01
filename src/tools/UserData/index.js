import Controller from '../Controller';

export default class UserData {
	static userName;
	static userFile;
	static userEmail;
	static userId;
	static userImgs;
	static darkTheme = false;

	static setData(userName, userFile, userEmail, userId, userImgs) {
		this.userName = userName;
		this.userFile = userFile;
		this.userEmail = userEmail;
		this.userId = userId;
		this.userImgs = userImgs;
	}
	static store(data) {
		this.userFile = data;
		Controller.storeUserFile();
	}

	static setImgs(userImgs) {
		this.userImgs = userImgs;
	}

	static getData() {
		return [this.userName, this.userFile, this.userEmail, this.userId];
	}

	static findImg(imgId) {
		for (let i in this.userImgs) {
			if (this.userImgs[i].imgId === imgId) {
				return this.userImgs[i];
			}
		}
	}

	static getImgData(imgId) {
		if (this.findImg(imgId)) return 'data:image/png;base64,' + this.findImg(imgId).imgData;
	}

	static getImgText(imgId) {
		if (this.findImg(imgId)) return this.findImg(imgId).imgText;
	}

	static getImgKeyword(imgId) {
		if (this.findImg(imgId)) return this.findImg(imgId).imgKeyword;
	}

	static getAllImgs() {
		return this.userImgs;
	}

	static getKeywordImgs(keyword) {
		let array = [];

		for (let i in this.userImgs) {
			if (this.userImgs[i].imgText.includes(keyword)) array.push(this.userImgs[i]);
		}
		return array;
	}

	static getFirstFile() {
		let isFind = false;
		let parents = [];
		let findFirst = (data, callback) => {
			for (let i = 0; i < data.length; i++) {
				if (isFind) break;

				if (data[i].isLeaf === true) {
					isFind = true;
					return callback(data[i], parents);
				}
				if (data[i].children) {
					parents.push(data[i].key);
					findFirst(data[i].children, callback);
				}
			}
		};
		let firstFile;
		findFirst(this.userFile, (first) => {
			firstFile = first;
		});
		return { firstFile: firstFile, parents: parents };
	}

	static findFile(data, key, callback) {
		for (let i = 0; i < data.length; i++) {
			if (data[i].key === key) {
				return callback(data[i]);
			}
			if (data[i].children) {
				this.findFile(data[i].children, key, callback);
			}
		}
	}
}
