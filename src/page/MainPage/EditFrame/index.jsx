import React, { Component, PureComponent, useState } from 'react';
import style from './index.module.scss';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

import EditablePage, { EditableBlock } from './EditablePage';
import EditManager from '../../../tools/EditFrame';
import TextEditor, { Selector } from '../../../tools/TextEditor';

// interface Iprop {
//  sortIndex: number,
// 	isHover: boolean,
// }
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

	// static getDerivedStateFromProps(props, state) {
	// 	if (props.sortIndex !== state.sortIndex) {
	// 		return {
	// 			sortIndex: props.sortIndex,
	// 		};
	// 	}
	// 	return null;
	// }
	handleChange(event) {
		this.state.EditList.strHtml = event.target.value;
	}

	// onFocus() {
	// 	this.placeholder = '';
	// }

	onMouseDown(event) {
		event.stopPropagation();
		EditManager.focusList = this.state.EditList;
		EditManager.focusIndex = this.state.EditList.sortIndex;

		let divOutWard = this.state.EditList.outWard;

		let interval = setInterval(() => {
			if (TextEditor.isChanging) {
			} else {
				TextEditor.moveEditor(divOutWard.intY, divOutWard.intWidth, divOutWard.intHeight);
				TextEditor.editorState.setContents(this.state.EditList.strHtml);
				TextEditor.focus();
				clearInterval(interval);
			}
		}, 50);

		// console.log(TextEditor.editorState.getContents());
		// TextEditor.moveEditor(divOutWard.intY, divOutWard.intWidth, divOutWard.intHeight);

		// TextEditor.editorState.setContents(this.state.EditList.strHtml);
		// TextEditor.asynToComponent(this.state.EditList.strHtml);
	}

	render() {
		let cardStyle = {
			marginRight: 0,
			height: '38px',
			visibility: this.props.isHover ? 'visible' : 'hidden',
		};
		return (
			<InputGroup>
				<Button
					id="btnMove"
					className="iconButton"
					variant="outline-secondary"
					style={cardStyle}
					onClick={() => {
						console.log(this.state.EditList.strHtml);
					}}
				>
					≡
				</Button>
				{/* <Form.Control
						type="text"
						className="textForm"
						placeholder="please enter something..."
						defaultValue={`${(<strong>123</strong>)}` + this.state.EditList.getContent()}
						onFocus={this.onFocus.bind(this)}
						onMouseDown={this.onMouseDown.bind(this)}
						onKeyDown={this.onKeyDown.bind(this)}
					></Form.Control> */}
				{/* <textarea className="textForm" style={{resize: 'both'}} value={this.state.EditList.getContent()}
							  onChange={(event) => {this.state.EditList.getContent() = event.target.value;
							  						this.setState({EditList: this.state.EditList})}}></textarea> */}
				<div
					className={style.textForm}
					ref={this.ref}
					placeholder="please enter something..."
					dangerouslySetInnerHTML={{ __html: this.state.EditList.strHtml }}
					onMouseDown={this.onMouseDown.bind(this)}
				>
				</div>
			</InputGroup>
		);
	}
}

// class CardText extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			EditList: props.EditList,
// 		};
// 		this.ref = React.createRef();

// 		this.onMouseDown = this.onMouseDown.bind(this);
// 		this.updatePageHandler = this.updatePageHandler.bind(this);
// 		this.addBlockHandler = this.addBlockHandler.bind(this);
// 		this.deleteBlockHandler = this.deleteBlockHandler.bind(this);
// 	}

// 	componentDidMount() {
// 		const testThis = this;
// 		const testSetState = this.setState;
// 		this.state.EditList.asynToComponent = () => {
// 			testSetState.call(testThis, { EditList: this.state.EditList });
// 		};

// 		this.state.EditList.divRef = this.ref.current;
// 	}

// 	componentDidUpdate() {
// 		if (Selector.getSel() !== '') {
// 			let rangeAt = Selector.getRan();
// 			TextEditor.selectContent(rangeAt.startOffset, rangeAt.endOffset);
// 		}
// 	}

// 	onMouseDown() {
// 		EditManager.focusList = this.state.EditList;
// 		TextEditor.editorState.setContents(this.ref.current.childNodes[0].childNodes[0].textContent);
// 	}

// 	updatePageHandler(updatedBlock) {
// 		let editList = this.state.EditList;
// 		editList.setHtml(updatedBlock.html);
// 		editList.tag = updatedBlock.tag;

// 		this.setState({ EditList: editList });
// 	}

// 	addBlockHandler() {
// 		EditManager.add(this.state.EditList.sortIndex);

// 		const delayer = setInterval(() => {
// 			if (EditManager.lisEditList[this.state.EditList.sortIndex + 1].divRef !== undefined) {
// 				EditManager.lisEditList[this.state.EditList.sortIndex + 1].divRef.childNodes[0].focus();
// 				clearInterval(delayer);
// 			}
// 		}, 50);
// 	}

// 	deleteBlockHandler() {
// 		EditManager.remove(this.state.EditList.sortIndex);

// 		const preBlock = EditManager.lisEditList[this.state.EditList.sortIndex - 1].divRef.childNodes[0];

// 		this.#setCaretToEnd(preBlock);
// 		preBlock.focus();
// 	}
// 	#setCaretToEnd(element) {
// 		const range = document.createRange();
// 		const selection = window.getSelection();
// 		range.selectNodeContents(element);
// 		range.collapse(false);
// 		selection.removeAllRanges();
// 		selection.addRange(range);
// 		element.focus();
// 	}

// 	render() {
// 		let cardStyle = {
// 			height: '38px',
// 			visibility: this.props.isHover ? 'visible' : 'hidden',
// 		};
// 		return (
// 			<InputGroup>
// 				<Button id="btnMove" className="iconButton" variant="outline-secondary" style={cardStyle}>
// 					≡
// 				</Button>

// 				<div className={style.textForm} ref={this.ref} onMouseDown={this.onMouseDown}>
// 					<EditableBlock
// 						id={this.state.EditList.intId}
// 						tag={this.state.EditList.tag}
// 						html={this.state.EditList.getHtml()}
// 						updatePage={this.updatePageHandler}
// 						addBlock={this.addBlockHandler}
// 						deleteBlock={this.deleteBlockHandler}
// 					/>
// 				</div>
// 			</InputGroup>
// 		);
// 	}
// }

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
		EditManager.swap(oldIndex, newIndex);
		// this.setState({
		// 	items: arrayMoveImmutable(this.state.items, oldIndex, newIndex),
		// });
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

export default class extends Component {
	constructor(props) {
		super(props);
		EditManager.initial();
	}

	render() {
		return (
			<div className={style.editFrame}>
				<SortableComponent />
			</div>
		);
	}
}
