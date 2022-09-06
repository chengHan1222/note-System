export default class IconFunction {}

export class StepControl {
	static #pointer = 0;
	static #lisStep = [];

	static initial(init) {
		StepControl.#lisStep.length = 0;
		StepControl.#lisStep.push(init);
	}

	// EditManager.lisEditList
	static addStep(step) {
		StepControl.#pointer++;
		if (StepControl.#pointer === StepControl.#lisStep.length - 1) StepControl.#lisStep.push(step);
		else {
			StepControl.#lisStep.length = StepControl.#pointer;
			StepControl.#lisStep.push(step);
		}
	}

	static get() {
		console.log(JSON.stringify(StepControl.#lisStep[StepControl.#pointer]));
	}

	static getStep() {
		return StepControl.#lisStep[StepControl.#pointer];
	}

	static undo() {
		StepControl.#pointer = StepControl.#pointer <= 0 ? 0 : StepControl.#pointer - 1;
		return StepControl.getStep();
	}

	static redo() {
		StepControl.#pointer =
			StepControl.#pointer >= StepControl.#lisStep.length - 1
				? StepControl.#lisStep.length - 1
				: StepControl.#pointer + 1;
		return StepControl.getStep();
	}
}
