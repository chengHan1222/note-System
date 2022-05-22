import React, { Component, PureComponent, useState } from 'react';
import './index.css';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

import ReactDraft from './ReactDraft';

import EditList, { EditManager } from '../../tools/EditFrame';

// interface Iprop {
// 	EditList: EditList,
//  sortIndex: number,
// 	isHover: boolean,
// }
class CardText extends PureComponent {
	EditList;

	constructor(props) {
		super(props);
		this.EditList = props.EditList;

		this.state = {
			sortIndex: props.sortIndex,
		};
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	static getDerivedStateFromProps(props, state) {
		if (props.sortIndex !== state.sortIndex) {
			return {
				sortIndex: props.sortIndex,
			}
		}
		return null;
	}
	// onAddChild() {
	// 	let prevSum = this.state.sum + 1;
	// 	this.setState({
	// 		sum: prevSum,
	// 	});
	// }
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
					<Form.Control type="text" className="textForm" placeholder="please enter something..." defaultValue={this.EditList.strContent}
								//   onFocus={()=>{console.log(this.state.sortIndex)}}
								  onKeyDown={this.onKeyDown}></Form.Control>
				</InputGroup>
			</>
		);
	}
}

const SortableItem = SortableElement(({ EditList, sortIndex }) => {
	// className="w-100"
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
				<CardText EditList={EditList} sortIndex={sortIndex} isHover={isHover}></CardText>
			</Card.Body>
		</Card>
	);
});

const SortableList = SortableContainer(({ items }) => {
	return (
		<div className="sortableList">
			{items.map((EditList, index) => (
				<SortableItem key={`item-${EditList.intId}`} index={index} EditList={EditList} sortIndex={index}/>
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
			mySetState.call(myThis, {items: EditManager.lisEditList})
		}
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
				<SortableComponent />
				<ReactDraft />
			</div>
		);
	}
}
