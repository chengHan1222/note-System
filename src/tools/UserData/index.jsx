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

}