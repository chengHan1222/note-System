export default class UserData {
    static userName;
    static userFile;
    static userEmail;
    static userId;
    static userImgs;


    static setData(userName, userFile, userEmail, userId, userImgs) {
        this.userName = userName;
        this.userFile = userFile;
        this.userEmail = userEmail;
        this.userId = userId;
        this.userImgs = userImgs;
    }

    static getData() {
        return [this.userName, this.userFile, this.userEmail, this.userId];
    }

    static getFirstFile() {
        let isFind = false;
        let parents = []
        let findFirst = (data, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (isFind) break;

                if (data[i].isLeaf === true) {
                    isFind = true;
                    return callback(data[i], parents);
                }
                if (data[i].children) {
                    parents.push(data[i].key)
                    findFirst(data[i].children, callback);
                }
            }
        }
        let firstFile;
        findFirst(this.userFile, (first) => {
            firstFile = first;
        });
        return {"firstFile": firstFile, "parents": parents};
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