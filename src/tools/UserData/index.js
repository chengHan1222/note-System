export default class UserData {
    static userName;
    static userFile;

    static setData(userName, userFile) {
        this.userName = userName;
        this.userFile = userFile;
    }

    static getData() {
        return [this.userName, this.userFile];
    }

    static getFirstFile() {
        let findFirst = (data, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].isLeaf === true) {
                    return callback(data[i]);
                }
                if (data[i].children) {
                    findFirst(data[i].children, callback);
                }
            }
        }
        let firstFile
        findFirst(this.userFile, (first) => {
            firstFile = first;
        });
        return firstFile;
    }
}