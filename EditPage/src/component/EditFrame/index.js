import React, { Component, PureComponent, useState } from 'react';
import './index.css';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

import ReactDraft from './ReactDraft';
import SunEditor from './SunEditor';

import { EditManager } from '../../tools/EditFrame';

// interface Iprop {
//  sortIndex: number,
// 	isHover: boolean,
// }
class CardText extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			EditList: props.EditList,
			sortIndex: props.sortIndex,
		};
		this.onKeyDown = this.onKeyDown.bind(this);
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
		this.state.EditList.strContent = event.target.value;
	}

	onKeyDown(event) {
		if (event.key === 'Enter') {
			EditManager.add(this.state.sortIndex);
		}
	}

	render() {
		let cardStyle = {
			visibility: this.props.isHover ? 'visible' : 'hidden',
		};
		return (
			<>
				<InputGroup>
					<Button id="btnMove" className="iconButton" variant="outline-secondary" style={cardStyle}>
						≡
					</Button>
					<Form.Control
						type="text"
						className="textForm"
						placeholder="please enter something..."
						defaultValue={`${(<strong>123</strong>)}` + this.state.EditList.strContent}
						onFocus={() => {
							this.placeholder = '';
						}}
						onKeyDown={this.onKeyDown}
					></Form.Control>
					{/* <textarea className="textForm" style={{resize: 'both'}} value={this.state.EditList.strContent}
							  onChange={(event) => {this.state.EditList.strContent = event.target.value;
							  						this.setState({EditList: this.state.EditList})}}></textarea> */}
					{/* <div contenteditable='true' onChange={this.handleChange}>{`${<strong>123</strong>}`+this.state.EditList.strContent}</div> */}
				</InputGroup>
			</>
		);
	}
}

const SortableItem = SortableElement(({ EditList, sortIndex }) => {
	const [isHover, setIsHover] = useState(false);
	return (
		<Card className="w-100">
			<Card.Body
				onMouseOver={() => {
					setIsHover(true);
				}}
				onMouseLeave={() => {
					setIsHover(false);
				}}
			>
				<CardText EditList={EditList} sortIndex={sortIndex}	isHover={isHover}></CardText>
			</Card.Body>
		</Card>
	);
});

const SortableList = SortableContainer(({ items }) => {
	return (
		<div className="sortableList">
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
			<div className="editFrame">
				<ReactDraft />
				{/* <SunEditor /> */}
				<SortableComponent />
			</div>
		);
	}
}
