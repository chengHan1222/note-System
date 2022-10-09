export default class TextEditor {
	static editorState;
	static isChanging = false;
	static sunContainer;
	static sunEditor;
	static EditFrame;

	static initial() {
		TextEditor.sunContainer = document.getElementsByClassName('se-container')[0];
		TextEditor.sunEditor = document.getElementsByClassName('se-wrapper')[0];
		TextEditor.EditFrame = window.innerHeight - 80;
		this.sunEditor.removeChild(this.sunEditor.childNodes[3]);
	}

	static moveEditor(intX, intY, intWidth, intHeight) {
		let oriDivLeft = this.sunContainer.offsetLeft;
		let oriDivTop = this.sunContainer.offsetTop;

		let currentY = intY - oriDivTop;
		// if (currentY > TextEditor.EditFrame) currentY -= 60;

		// TextEditor.sunEditor.style.left = intX - oriDivLeft + 'px';
		// TextEditor.sunEditor.style.top = currentY + 'px';
		// this.sunEditor.style.width = intWidth + 'px';
		// this.sunEditor.style.height = intHeight + 'px';

		this.sunEditor.style.display = 'block';
	}

	static focus(caretIndex) {
		let editor = TextEditor.sunEditor.childNodes[2];
		editor.focus();

		setTimeout(() => {
			TextEditor.setCaret(caretIndex);
		}, 0);
	}

	static getSunEditor() {
		return this.sunEditor;
	}

	static showEditor() {
		this.sunEditor.style.display = 'block';
	}

	// static setCaret(editor, index) {
	// 	let range = document.createRange();
	// 	range.setStart(editor, index);
	// 	range.setEnd(editor, index);
	// 	Selector.selector.removeAllRanges();
	// 	Selector.selector.addRange(range);
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
