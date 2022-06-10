import React, { Component, PureComponent, useState } from 'react';
import style from './index.module.scss';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

import EditManager from '../../../tools/EditFrame';
import TextEditor from '../../../tools/TextEditor';

// interface Iprop {
//  sortIndex: number,
// 	isHover: boolean,
// }
class CardText extends Component {
	text_editor;
	constructor(props) {
		super(props);

		this.text_editor = document.getElementsByClassName('se-wrapper');

		this.state = {
			EditList: props.EditList,
			sortIndex: props.sortIndex,
		};

		// document.addEventListener('mousedown', () => {this.text_editor[0].style.display = 'none'})
	}

	componentDidMount() {
		const testThis = this;
		const testSetState = this.setState;
		this.state.EditList.asynToComponent = () => {
			testSetState.call(testThis, { EditList: this.state.EditList });
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (props.sortIndex !== state.sortIndex) {
			return {
				sortIndex: props.sortIndex,
			};
		}
		return null;
	}
	handleChange(event) {
		this.state.EditList.setContent(event.target.value);
	}

	onFocus() {
		this.placeholder = '';
	}

	onMouseDown(event) {
		event.stopPropagation();
		EditManager.focusIndex = this.state.EditList.intId;

		let focusDiv = event.currentTarget;

		let target_offset = focusDiv.getBoundingClientRect();
		// this.text_editor[0].style.top = target_offset.y + 'px';
		// this.text_editor[0].style.top = '0px';
		this.text_editor[0].style.height = target_offset.height + 'px';
		this.text_editor[0].style.width = target_offset.width + 'px';
		this.text_editor[0].style.display = 'block';
		// this.text_editor[0].style.backgroundColor = 'black';
		// this.text_editor[0].childNodes[2].style.backgroundColor = '#ced4da';
		// setTimeout(() => {
		// 	this.text_editor[0].childNodes[2].style.backgroundColor = 'white';
		// }, 1000);

		TextEditor.asynToComponent(this.state.EditList.getContent());
	}

	onKeyDown(event) {
		if (event.key === 'Enter') {
			EditManager.add(this.state.sortIndex);
		}
	}

	render() {
		let cardStyle = {
			height: '38px',
			visibility: this.props.isHover ? 'visible' : 'hidden',
		};
		return (
			<InputGroup>
				<Button id="btnMove" className="iconButton" variant="outline-secondary" style={cardStyle}>
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
					placeholder="please enter something..."
					dangerouslySetInnerHTML={{ __html: this.state.EditList.getContent() }}
					onFocus={this.onFocus.bind(this)}
					onMouseDown={this.onMouseDown.bind(this)}
					onKeyDown={this.onKeyDown.bind(this)}
				></div>
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
		// EditManager.swap(oldIndex, newIndex);
		// console.log(EditManager.lisEditList);
		this.setState({
			items: arrayMoveImmutable(this.state.items, oldIndex, newIndex),
		});
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
