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

	static getSunEditor() {
		return this.sunEditor;
	}

	static showEditor() {
		this.sunEditor.style.display = 'block';
	}

	// static setCaret(index) {
	// 	let range = document.createRange();
	// 	let textNode = TextEditor.sunEditor.childNodes[2];
	// 	while (textNode.childNodes.length !== 0) {
	// 		textNode = textNode.childNodes[0];
	// 	}
	// 	range.setStart(textNode, index);
	// 	range.setEnd(textNode, index);
	// 	range.collapse(true);
	// 	Selector.selector.removeAllRanges();
	// 	Selector.selector.addRange(range);
	// }

	static setCaret(index) {
		let range;
		for (let i = 0; i < Selector.selector.rangeCount; i++) {
			range = Selector.selector.getRangeAt(i);
		}
		let textNode = !Selector.isUL ? range.startContainer : range.startContainer.parentNode.parentNode.lastChild.childNodes[0];
		Selector.isUL = false;
		while (textNode.childNodes.length !== 0) {
			textNode = textNode.childNodes[0];
		}

		if (textNode.length < index) index = textNode.length;
		if (textNode.length === undefined) index = 0;
		range.setStart(textNode, index);
		range.setEnd(textNode, index);
		Selector.selector.removeAllRanges();
		Selector.selector.addRange(range);
	}

	static setSunEditorHTML(html) {
		this.sunEditor.childNodes[2].innerHTML = html;
	}

	static asynToComponent(content) {}
}

export class Selector {
	static nowCaretIndex;
	static isUL = false;
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
