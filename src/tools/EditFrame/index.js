class OutWard {
	intX;
	intY;
	intWidth;
	intHeight;
}

export class EditList {
	#strContent;
	divRef;
	intId;
	outWard;

	constructor(strContent) {
		this.#strContent = strContent;
		this.intId = EditManager.intEditListCount++;
		this.outWard = new OutWard();
	}

	getContent() {
		return this.#strContent;
	}

	setContent(content) {
		this.#strContent = content;
	}

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
	static focusIndex = null;

	static initial() {
		EditManager.lisEditList.length = 0;
		EditManager.intEditListCount = 0;

		for (let i = 0; i < 8; i++) {
			EditManager.lisEditList.push(new EditList(`List  ${i}`));
		}
		EditManager.lisEditList.push(new EditList(''));
	}

	static add(index) {
		EditManager.lisEditList.splice(index + 1, 0, new EditList());
		EditManager.asynToComponent();
	}

	static getFocusList() {
		return (EditManager.focusIndex >= 0 && EditManager.focusIndex < EditManager.lisEditList.length)
				? EditManager.lisEditList[EditManager.focusIndex]:
				"not Found";
	}

	static remove(index) {
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
