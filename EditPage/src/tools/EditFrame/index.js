export default class EditList {
	strContent;
	intId;

	constructor(strContent) {
		this.strContent = strContent;
		this.intId = EditManager.intEditListCount++;
	}

	getBold() {
		this.strContent = '<bold>123</bold>'
	}

	asynToComponent() {}
}




export class EditManager {
	static lisEditList = [];
	static intEditListCount = 0;
	static focusIndex = null;

	static initial() {
		EditManager.lisEditList.length = 0;
		EditManager.intEditListCount = 0;

		for (let i = 0; i < 8; i++) {
			EditManager.lisEditList.push(new EditList('List ' + i));
		}
		EditManager.lisEditList.push(new EditList('<strong>1231</strong>' + 10));
	}

	static add(index) {
		EditManager.lisEditList.splice(index + 1, 0, new EditList());
		EditManager.asynToComponent();
	}

	static remove(index) {
		EditList.lisEditList.splice(index, 1);
		EditManager.asynToComponent();
	}

	static swap(oldIndex, newIndex) {
		let editList = EditManager.lisEditList[oldIndex];
		EditManager.lisEditList.splice(oldIndex, 1);
		EditManager.lisEditList.splice(newIndex, 0, editList);
	}

	static asynToComponent() {}
}
