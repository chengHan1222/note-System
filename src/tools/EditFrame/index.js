import { StepControl } from '../IconFunction';

class OutWard {
	intX;
	intY;
	intWidth;
	intHeight;
}

const uid = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export class EditList {
	strHtml;
	divRef;
	intId;
	outWard = new OutWard();
	sortIndex;

	constructor(html, sortIndex) {
		this.strHtml = html;
		this.sortIndex = sortIndex;
		this.intId = uid();
	}

	// insertTag(tag, start, end) {
	// 	let endTag = EditList.#insertString(tag, "/", 1);
	// 	this.#strHtml = EditList.#insertString(this.#strHtml, tag, start);
	// 	this.#strHtml = EditList.#insertString(this.#strHtml, endTag, end + tag.length);

	// 	// this.asynToComponent();
	// }
	// static #insertString(oldContent, insertContent, splitIndex) {
	// 	return oldContent.substring(0, splitIndex) + insertContent + oldContent.substring(splitIndex, oldContent.length);
	// }

	setOutWard() {
		let offset = this.divRef.getBoundingClientRect();
		this.outWard.intX = offset.x;
		this.outWard.intY = offset.y;
		this.outWard.intWidth = offset.width;
		this.outWard.intHeight = offset.height;
	}

	asynToComponent() {}
}

export default class EditManager {
	static lisEditList = [];
	static intEditListCount = 0;
	static focusList;
	static focusIndex;

	static initial() {
		EditManager.lisEditList.length = 0;
		EditManager.intEditListCount = 0;

		for (let i = 0; i < 8; i++) {
			EditManager.lisEditList.push(new EditList(`List  ${i}`, this.#getCount()));
		}
		EditManager.lisEditList.push(new EditList('<strong>123</strong>', this.#getCount()));

		StepControl.initial([...this.lisEditList]);
	}

	static add(index) {
		EditManager.lisEditList.splice(index + 1, 0, new EditList('', this.#getCount()));
		this.#updateIndex(index + 1, this.lisEditList.length);

		EditManager.asynToComponent();
	}

	static #getCount() {
		return this.intEditListCount++;
	}

	static getFocusList() {
		return EditManager.focusIndex >= 0 && EditManager.focusIndex < EditManager.lisEditList.length
			? EditManager.lisEditList[EditManager.focusIndex]
			: 'not Found';
	}

	static getJSON() {}

	static remove(index) {
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
