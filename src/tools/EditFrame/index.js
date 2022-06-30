const uid = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export class EditList {
	#strHtml;
	divRef;
	intId;
	tag = 'p';
	sortIndex;

	constructor(html, sortIndex) {
		this.#strHtml = html;
		this.sortIndex = sortIndex;
		this.intId = uid();
	}

	getHtml() {
		return this.#strHtml;
	}

	setHtml(html) {
		this.#strHtml = html;
	}

	// setOutWard() {
	// 	let offset = this.divRef.getBoundingClientRect();
	// 	this.outWard.intX = offset.x;
	// 	this.outWard.intY = offset.y;
	// 	this.outWard.intWidth = offset.width;
	// 	this.outWard.intHeight = offset.height;
	// }

	asynToComponent() {}
}




export default class EditManager {
	static lisEditList = [];
	static intEditListCount = 0;
	static focusIndex = null;

	static initial() {
		EditManager.lisEditList.length = 0;
		EditManager.intEditListCount = 0;

		for (let i = 0; i < 8; i++) {
			EditManager.lisEditList.push(new EditList(`List  ${i}`, this.#getCount()));
		}
		EditManager.lisEditList.push(new EditList('', this.#getCount()));
	}

	static add(index) {
		EditManager.lisEditList.splice(index + 1, 0, new EditList('', this.#getCount()));
		this.#updateIndex(index + 1, this.lisEditList.length);

		EditManager.asynToComponent();
	}

	static getFocusList() {
		return (EditManager.focusIndex >= 0 && EditManager.focusIndex < EditManager.lisEditList.length)
				? EditManager.lisEditList[EditManager.focusIndex]:
				"not Found";
	}

	static #getCount() {
		return this.intEditListCount++;
	}

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
