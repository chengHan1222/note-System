import TextEditor from '../TextEditor';
import UserData from '../UserData';

const uid = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export class EditList {
	strHtml;
	imgSrc;
	divRef;
	intId;
	type = 'string';
	sortIndex;

	constructor(html, sortIndex, type) {
		this.strHtml = html;
		this.sortIndex = sortIndex;
		this.type = type;
		this.intId = uid();
	}

	setSunEditor() {}

	asynToComponent() {}
}

export default class EditManager {
	static lisEditList = [];
	static intEditListCount = 0;
	// static focusList;
	static focusIndex = -1;

	static add(index) {
		EditManager.lisEditList.splice(index + 1, 0, new EditList('<p><br></p>'));

		EditManager.asynToComponent();
	}

	// static getFocusList() {
	// 	return EditManager.focusIndex >= 0 && EditManager.focusIndex < EditManager.lisEditList.length
	// 		? EditManager.lisEditList[EditManager.focusIndex]
	// 		: 'not Found';
	// }

	static outputFile() {
		return EditManager.lisEditList.map((element) => {
			if (!element.type) element.type = 'string';
			return { strHtml: element.strHtml, type: element.type };
		});
	}

	static increaseIndex() {
		this.focusIndex = this.focusIndex + 1 < EditManager.lisEditList.length ? this.focusIndex + 1 : this.focusIndex;
		this.#focusNewDiv();
	}
	static decreaseIndex() {
		this.focusIndex = this.focusIndex - 1 >= 0 ? this.focusIndex - 1 : 0;
		this.#focusNewDiv();
	}
	static #focusNewDiv() {
		let newList = this.lisEditList[this.focusIndex];
		if (newList.type === 'string') {
			newList.setSunEditor();

			TextEditor.showEditor();
			TextEditor.setSunEditorHTML(newList.strHtml);
		}
	}

	static readFile(list) {
		this.lisEditList.length = 0;

		list.forEach((element, index) => {
			let obj = new EditList(element.strHtml, index, element.type);
			if (element.type === 'image') {
				obj.imgSrc = UserData.getImgData(element.strHtml);
			}
			this.lisEditList.push(obj);
		});

		this.intEditListCount = this.lisEditList.length;

		this.asynToComponent();
	}

	static removeItem(index) {
		EditManager.lisEditList.splice(index, 1);

		EditManager.asynToComponent();
	}

	static swap(oldIndex, newIndex) {
		let editList = EditManager.lisEditList[oldIndex];
		EditManager.lisEditList.splice(oldIndex, 1);
		EditManager.lisEditList.splice(newIndex, 0, editList);
	}

	static asynToComponent(content) {}
}
