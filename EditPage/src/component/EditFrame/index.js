import React, { Component, PureComponent, useState } from 'react';
import './index.css';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

import EditList, { EditManager } from '../../tools/EditFrame';

class CardText extends PureComponent {
	constructor(props) {
		super(props);
		this.title = props.title;
		// this.state = {
		// 	sum: 0,
		// };
		// this.onAddChild = this.onAddChild.bind(this);
	}
	// onAddChild() {
	// 	let prevSum = this.state.sum + 1;
	// 	this.setState({
	// 		sum: prevSum,
	// 	});
	// }
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
					<Form.Control type="text" className="textForm" placeholder="please enter something..."></Form.Control>
				</InputGroup>
			</>
		);
	}
}

const SortableItem = SortableElement(({ value }) => {
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
				<CardText title={value} isHover={isHover}></CardText>
			</Card.Body>
		</Card>
	);
});

const SortableList = SortableContainer(({ items }) => {
	return (
		<div className="sortableList">
			{items.map((value, index) => (
				<SortableItem key={`item-${value}`} index={index} value={value} />
			))}
		</div>
	);
});

class SortableComponent extends Component {
	state = {
		items: EditManager.lisEditList,
	};

	onSortEnd = ({ oldIndex, newIndex }) => {
		EditManager.swap(oldIndex, newIndex);
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
	render() {
		return (
			<div className="editFrame">
				<SortableComponent />
			</div>
		);
	}
}
