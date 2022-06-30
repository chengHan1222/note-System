import React, { Component, PureComponent, useState } from 'react';
import style from './index.module.scss';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

import EditablePage from './EditablePage';
import EditManager from '../../../tools/EditFrame';
import TextEditor from '../../../tools/TextEditor';

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
			sortIndex: props.sortIndex,
		};
	}

	// componentDidMount() {
	// 	const testThis = this;
	// 	const testSetState = this.setState;
	// 	this.state.EditList.asynToComponent = () => {
	// 		testSetState.call(testThis, { EditList: this.state.EditList });
	// 	};

	// 	this.state.EditList.divRef = this.ref.current;
	// }

	// componentDidUpdate() {
	// 	this.state.EditList.setOutWard();
	// }

	// static getDerivedStateFromProps(props, state) {
	// 	if (props.sortIndex !== state.sortIndex) {
	// 		return {
	// 			sortIndex: props.sortIndex,
	// 		};
	// 	}
	// 	return null;
	// }
	// handleChange(event) {
	// 	this.state.EditList.setContent(event.target.value);
	// }

	// onFocus() {
	// 	this.placeholder = '';
	// }

	// onMouseDown(event) {
	// 	event.stopPropagation();
	// 	EditManager.focusIndex = this.state.sortIndex;

	// 	let divOutWard = this.state.EditList.outWard;
	// 	TextEditor.moveEditor(divOutWard.intY, divOutWard.intWidth, divOutWard.intHeight);

	// 	TextEditor.asynToComponent(this.state.EditList.getContent());
	// 	// TextEditor.editorState.setContents(this.state.EditList.getContent());
	// }

	render() {
		let cardStyle = {
			height: '38px',
			visibility: this.props.isHover ? 'visible' : 'hidden',
		};
		return (
			
			<InputGroup>
				<Button id="btnMove" className="iconButton" variant="outline-secondary" style={cardStyle} onClick={() => {console.log(this.state.sortIndex)}}>
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
				{/* <div
					className={style.textForm}
					ref={this.ref}
					placeholder="please enter something..."
					dangerouslySetInnerHTML={{ __html: this.state.EditList.getContent() }}
					onFocus={this.onFocus.bind(this)}
					onMouseDown={this.onMouseDown.bind(this)}
				></div> */}

				<EditablePage />
			</InputGroup>
		);
	}
}

const SortableItem = SortableElement(({ EditList, sortIndex }) => {
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
				<CardText EditList={EditList} sortIndex={sortIndex} isHover={isHover}></CardText>
			</Card.Body>
		</Card>
	);
});

const SortableList = SortableContainer(({ items }) => {
	return (
		<div className={style.sortableList}>
			{items.map((EditList, index) => (
				<SortableItem key={`item-${EditList.intId}`} index={index} EditList={EditList} sortIndex={index} />
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
