export default class TextEditor {
	static editorState;
	static isChanging = false;

	static moveEditor(intY, intWidth, intHeight) {
		let editor = document.getElementsByClassName('se-wrapper')[0];
		editor.style.top = intY + 'px';
		editor.style.width = intWidth + 'px';
		editor.style.height = intHeight + 'px';

		editor.style.display = 'block';
	}

	static focus(caretIndex) {
		let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
		editor.focus();

		TextEditor.changeBKColor();

		TextEditor.setCaret(caretIndex);
	}

	static changeBKColor() {
		let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
		editor.style.backgroundColor = 'rgb(198, 198, 198)';
		setTimeout(() => {
			editor.style.backgroundColor = 'white';
		}, 400);
	}

	static setCaret(index) {
		let range;
		for (let i = 0; i < Selector.selector.rangeCount; i++) {
			range = Selector.selector.getRangeAt(i);
		}
		let textNode = range.startContainer;
		range.setStart(textNode, index);
		range.setEnd(textNode, index);

		Selector.selector.addRange(range);
	}

	static asynToComponent(content) {}
}

export class Selector {
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
