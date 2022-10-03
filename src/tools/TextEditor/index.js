export default class TextEditor {
	static editorState;
	static isChanging = false;

	static moveEditor(intX, intY, intWidth, intHeight) {
		let oriDiv = document.getElementsByClassName('se-container')[0];
		let oriDivLeft = oriDiv.offsetLeft;
		let oriDivTop = oriDiv.offsetTop;
		let editor = document.getElementsByClassName('se-wrapper')[0];
		editor.style.left = intX - oriDivLeft - 270 + 'px';
		editor.style.top = intY - oriDivTop + 'px';
		editor.style.width = intWidth + 'px';
		// editor.style.height = intHeight + 'px';

		editor.style.display = 'block';
	}

	static focus(caretIndex) {
		let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
		editor.focus();

		// TextEditor.changeBKColor();

		setTimeout(() => {
			TextEditor.setCaret(caretIndex);
		}, 0);
	}

	// static changeBKColor() {
	// 	let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
	// 	editor.style.backgroundColor = 'rgb(198, 198, 198)';
	// 	setTimeout(() => {
	// 		editor.style.backgroundColor = 'white';
	// 	}, 400);
	// }

	static setCaret(index) {
		let range;
		for (let i = 0; i < Selector.selector.rangeCount; i++) {
			range = Selector.selector.getRangeAt(i);
		}
		let textNode = range.startContainer;
		while (textNode.childNodes.length !== 0) {
			textNode = textNode.childNodes[0];
		}

		if (textNode.length < index) index = textNode.length;
		if (textNode.length === undefined) index = 0;
		range.setStart(textNode, index);
		range.setEnd(textNode, index);

		Selector.selector.addRange(range);
	}

	static asynToComponent(content) {}
}

export class Selector {
	static nowCaretIndex;
	static selector = window.getSelection();

	static getSel() {
		return this.selector.toString();
	}

	static getRan() {
		for (let i = 0; i < this.selector.rangeCount; i++) {
			console.log(this.selector.getRangeAt(i));
		}
	}
}
