const uid = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export class EditList {
	strHtml;
	divRef;
	intId;
	sortIndex;

	constructor(html, sortIndex) {
		this.strHtml = html;
		this.sortIndex = sortIndex;
		this.intId = uid();
	}

	setSunEditor() {}

	asynToComponent() {}
}

export default class EditManager {
	static lisEditList = [];
	static intEditListCount = 0;
	static focusList;
	static focusIndex;

	static add(index) {
		EditManager.lisEditList.splice(index + 1, 0, new EditList('<p><br></p>'));
		this.#updateIndex(index + 1, this.lisEditList.length);

		EditManager.asynToComponent();
	}

	static getFocusList() {
		return EditManager.focusIndex >= 0 && EditManager.focusIndex < EditManager.lisEditList.length
			? EditManager.lisEditList[EditManager.focusIndex]
			: 'not Found';
	}

	static getFile() {
		let list = [];
		EditManager.lisEditList.forEach((element) => {
			list.push(element.strHtml);
		});

		return list;
	}

	static readFile(list) {
		EditManager.lisEditList.length = 0;

		list.forEach((Element, index) => {
			EditManager.lisEditList.push(new EditList(Element, index));
		});

		this.intEditListCount = EditManager.lisEditList.length;

		this.asynToComponent();
	}

	static removeItem(index) {
		EditManager.lisEditList.splice(index, 1);
		this.#updateIndex(index, this.lisEditList.length);

		EditManager.asynToComponent();
	}

	static swap(oldIndex, newIndex) {
		let editList = EditManager.lisEditList[oldIndex];
		EditManager.lisEditList.splice(oldIndex, 1);
		EditManager.lisEditList.splice(newIndex, 0, editList);

		this.#updateIndex(oldIndex, newIndex + 1);
	}

	static #updateIndex(start, end) {
		for (let i = start; i < end; i++) {
			EditManager.lisEditList[i].sortIndex = i;
		}
	}

	static asynToComponent(content) {}
}
