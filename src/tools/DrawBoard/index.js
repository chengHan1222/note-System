export default class DrawBoard {
	static canvas;
	static ctx;

	static isDrawBoardOpen = false;
	static isErasering = false;
	static color = 'black';
	static size = 15;
	static layer = 0;
	static listLayer = [];

	static changeSize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	static getFocusCtx() {
		return document.getElementById(this.listLayer[this.layer - 1]).getContext('2d');
	}

	static save() {
		let savedImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.listLayer[++this.layer] = savedImage;
		if (this.listLayer.length > this.layer + 1) {
			this.listLayer.length = this.layer + 1;
		}
	}

	static undo() {
		if (this.layer === 1) return;
		this.ctx.putImageData(this.listLayer[--this.layer], 0, 0);
	}

	static redo() {
		if (this.layer === this.listLayer.length - 1) return;
		this.ctx.putImageData(this.listLayer[++this.layer], 0, 0);
	}
}
