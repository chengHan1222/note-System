import React, { Component } from 'react';

import style from './index.module.scss';
import './outSideCss.css';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import { arrayMoveImmutable } from 'array-move';
import { Button, Card, InputGroup } from 'react-bootstrap';
import ContentEditable from 'react-contenteditable';

import EditManager from '../../../tools/EditFrame';
import TextEditor, { Selector } from '../../../tools/TextEditor';
import { StepControl } from '../../../tools/IconFunction';

class CardText extends Component {
	constructor(props) {
		super(props);

		this.ref = React.createRef();
		this.buttonRef = React.createRef();

		this.state = {
			EditList: props.EditList,
			onFocus: false,
		};

		this.onFocus = this.onFocus.bind(this);
	}

	componentDidMount() {
		this.state.EditList.setSunEditor = () => {
			setTimeout(() => {
				this.setState({ onFocus: true }, () => {
					this.ref.current.appendChild(TextEditor.sunEditor);
					EditManager.focusIndex = this.state.EditList.sortIndex;
					TextEditor.sunEditor.childNodes[2].focus();
					TextEditor.setCaret(Selector.nowCaretIndex);
				});
			}, 50);
		};

		this.state.EditList.asynToComponent = () => {
			if (EditManager.focusIndex === this.state.EditList.sortIndex) return;

			this.setState({ EditList: this.state.EditList, onFocus: false });
		};

		this.state.EditList.divRef = this.ref.current;
	}

	onFocus(event) {
		event.stopPropagation();

		EditManager.focusList = this.state.EditList;
		EditManager.focusIndex = this.state.EditList.sortIndex;

		let interval = setInterval(() => {
			if (!TextEditor.isChanging) {
				TextEditor.editorState.setContents(this.state.EditList.strHtml);
				TextEditor.showEditor();

				Selector.nowCaretIndex = Selector.selector.anchorOffset;
				this.state.EditList.setSunEditor();

				clearInterval(interval);
			}
		}, 50);
	}

	render() {
		let cardStyle = {
			marginRight: 0,
			height: '38px',
			visibility: 'hidden',
		};
		return (
			<InputGroup
				onMouseOver={() => {
					this.buttonRef.current.style.visibility = 'visible';
				}}
				onMouseLeave={() => {
					this.buttonRef.current.style.visibility = 'hidden';
				}}
			>
				<Button
					id="btnMove"
					className="iconButton"
					ref={this.buttonRef}
					variant="outline-secondary"
					style={cardStyle}
					onClick={() => {
						console.log(this.state.EditList.sortIndex);
					}}
				>
					≡
				</Button>
				{!this.state.onFocus ? (
					<ContentEditable
						className={`se-wrapper-wysiwyg sun-editor-editable ${style.textForm}`}
						innerRef={this.ref}
						placeholder="please enter something..."
						html={this.state.EditList.strHtml}
						onFocus={this.onFocus}
					/>
				) : (
					<div ref={this.ref} className={style.sunEditorDiv} style={{ width: 'calc(100% - 80px)' }}></div>
				)}
			</InputGroup>
		);
	}
}

const SortableItem = SortableElement(({ EditList }) => {
	return (
		<Card className={style.card}>
			<Card.Body className={style.cardBody}>
				<CardText EditList={EditList}></CardText>
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
	render() {
		return (
			<div className={style.editFrame}>
				<SortableComponent />
			</div>
		);
	}
}
