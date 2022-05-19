export default class EditList {
	constructor() {}

	add(index) {
		EditManager.lisEditList.splice(index, 0, new EditList());
	}

	remove(index) {
		EditList.lisEditList.splice(index, 1);
	}
}

export class EditManager {
	static lisEditList = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'];

	static swap(oldIndex, newIndex) {
		let editList = EditManager.lisEditList[oldIndex];
		EditManager.lisEditList.splice(oldIndex, 1);
		EditManager.lisEditList.splice(newIndex, 0, editList);
	}
}
