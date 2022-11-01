export default class DrawBoard {
	static color = 'red';
	static isDrawBoardOpen = false;
	static isErasering = false;
	static layer = 0;
	static listLayer = [];
	static size = 5;


	static getFocusCtx() {
		return document.getElementById(this.listLayer[this.layer - 1]).getContext('2d');
	}

	static save(ctx) {
		ctx.save();
		this.layer++;
	}

	static restore(ctx) {
		ctx.restore();
	}
}
