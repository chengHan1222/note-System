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

	static focus() {
		let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
		editor.focus();
		console.log(editor)

		TextEditor.changeBKColor();
	}

	static changeBKColor() {
		let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
		editor.style.backgroundColor = 'rgb(198, 198, 198)';
		setTimeout(() => {
			editor.style.backgroundColor = 'white';
		}, 400);
	}

	static selectContent(start, end) {
		// let node = document.getElementsByClassName('se-wrapper')[0].childNodes[2].childNodes[0].childNodes[0];
		// const range = document.createRange();
		// range.setStart(node, start);
		// range.setEnd(node, end);
		// textSelector.removeAllRanges();
        // Selector.selector.addRange(range);
		// this.editorState.core.setRange(node, start, node, end)
	}

	static asynToComponent(content) {}
}

export class Selector {
	static selector = window.getSelection();

	static getSel() {
		return this.selector.toString();
	}

	static getRan() {
		return this.selector.getRangeAt(0);
	}
}
