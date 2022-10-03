import React, { Component, useEffect, useState } from 'react';

import style from './index.module.scss';
import './outSideCss.css';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import { arrayMoveImmutable } from 'array-move';
import { Button, Card, InputGroup } from 'react-bootstrap';
import ContentEditable from 'react-contenteditable';

// import EditablePage, { EditableBlock } from './EditablePage';
import EditManager from '../../../tools/EditFrame';
import TextEditor, { Selector } from '../../../tools/TextEditor';
import { StepControl } from '../../../tools/IconFunction';

class CardText extends Component {
	constructor(props) {
		super(props);

		this.ref = React.createRef();

		this.state = {
			EditList: props.EditList,
			content: props.EditList.strHtml,
		};
	}

	componentDidMount() {
		const testThis = this;
		const testSetState = this.setState;
		this.state.EditList.asynToComponent = () => {
			testSetState.call(testThis, { EditList: this.state.EditList });
		};

		this.state.EditList.divRef = this.ref.current;
		this.state.EditList.setOutWard();
	}

	componentDidUpdate() {
		this.state.EditList.setOutWard();
	}

	handleChange(event) {
		this.state.EditList.strHtml = event.target.value;
	}

	onMouseDown(event) {
		event.stopPropagation();
		EditManager.focusList = this.state.EditList;
		EditManager.focusIndex = this.state.EditList.sortIndex;

		let divOutWard = this.state.EditList.outWard;

		let interval = setInterval(() => {
			if (!TextEditor.isChanging) {
				TextEditor.moveEditor(divOutWard.intX, divOutWard.intY, divOutWard.intWidth, divOutWard.intHeight);
				TextEditor.editorState.setContents(this.state.EditList.strHtml);

				Selector.nowCaretIndex = Selector.selector.anchorOffset;
				TextEditor.focus(Selector.selector.anchorOffset);
				clearInterval(interval);
			}
		}, 50);
	}

	render() {
		let cardStyle = {
			marginRight: 0,
			height: '38px',
			visibility: this.props.isHover ? 'visible' : 'hidden',
		};
		return (
			<InputGroup>
				<Button id="btnMove" className="iconButton" variant="outline-secondary" style={cardStyle}>
					≡
				</Button>
				<ContentEditable
					className={`se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable ${style.textForm}`}
					innerRef={this.ref}
					placeholder="please enter something..."
					disabled={true}
					html={this.state.EditList.strHtml}
					onMouseDown={this.onMouseDown.bind(this)}
				/>
			</InputGroup>
		);
	}
}

const SortableItem = SortableElement(({ EditList }) => {
	const [isHover, setIsHover] = useState(false);
	return (
		<Card className={style.card}>
			<Card.Body
				className={style.cardBody}
				onMouseOver={() => {
					setIsHover(true);
				}}
				onMouseLeave={() => {
					setIsHover(false);
				}}
			>
				<CardText EditList={EditList} isHover={isHover}></CardText>
			</Card.Body>
		</Card>
	);
});

const SortableList = SortableContainer(({ items }) => {
	return (
		<div className={style.sortableList}>
			{items.map((EditList, index) => (
				<SortableItem key={`item-${EditList.intId}`} index={index} EditList={EditList} />
			))}
		</div>
	);
});

class SortableComponent extends Component {
	state = {
		items: EditManager.lisEditList,
	};

	componentDidMount() {
		const myThis = this;
		const mySetState = this.setState;
		EditManager.asynToComponent = () => {
			mySetState.call(myThis, { items: EditManager.lisEditList });
		};
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex === newIndex) return;

		EditManager.swap(oldIndex, newIndex);
		// this.setState({
		// 	items: arrayMoveImmutable(this.state.items, oldIndex, newIndex),
		// });
		StepControl.addStep(EditManager.getFile());
	};

	shouldCancelStart = (event) => {
		let targetEle = event;
		if (!targetEle.id) {
			targetEle = event.target;
		}

		if (targetEle.id === 'btnMove') {
			targetEle = event.target;
			return false;
		} else {
			return true;
		}
	};

	render() {
		return (
			<>
				<SortableList
					items={this.state.items}
					onSortEnd={this.onSortEnd}
					axis="xy"
					shouldCancelStart={this.shouldCancelStart}
				/>
			</>
		);
	}
}

export default class EditFrame extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={style.editFrame}>
				<SortableComponent />
			</div>
		);
	}
}
