export default class TextEditor {
	static editorState;

	static moveEditor(intY, intWidth, intHeight) {
		let editor = document.getElementsByClassName('se-wrapper')[0];
		editor.style.top = intY + 'px';
		editor.style.width = intWidth + 'px';
		editor.style.height = intHeight + 'px';

		editor.style.display = 'block';
	}

	static focus() {
		let editor = document.getElementsByClassName('se-wrapper')[0];
		editor.childNodes[2].focus();
	}

	static asynToComponent(content) {}
}
