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
		let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
		editor.focus();
		
		TextEditor.changeBKColor();
	}

	static changeBKColor() {
		let editor = document.getElementsByClassName('se-wrapper')[0].childNodes[2];
		editor.style.backgroundColor = 'rgb(198, 198, 198)';
		setTimeout(() => {
			editor.style.backgroundColor = 'white';
		}, 400);
	}

	static asynToComponent(content) {}
}
