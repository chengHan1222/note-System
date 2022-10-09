import React, { Component } from 'react';

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
		this.buttonRef = React.createRef();

		this.state = {
			EditList: props.EditList,
			onClick: false,
		};

		this.onFocus = this.onFocus.bind(this);
	}

	componentDidMount() {
		const testThis = this;
		const testSetState = this.setState;
		this.state.EditList.asynToComponent = () => {
			testSetState.call(testThis, { EditList: this.state.EditList, onClick: false }, () => {
				this.state.EditList.setOutWard();
			});
		};

		this.state.EditList.divRef = this.ref.current;
		this.state.EditList.setOutWard();
	}

	onFocus(event) {
		// event.stopPropagation();
		EditManager.focusList = this.state.EditList;
		EditManager.focusIndex = this.state.EditList.sortIndex;

		let interval = setInterval(() => {
			if (!TextEditor.isChanging) {
				TextEditor.editorState.setContents(this.state.EditList.strHtml);
				TextEditor.showEditor();

				TextEditor.focus(Selector.selector.anchorOffset);
				Selector.nowCaretIndex = Selector.selector.anchorOffset;

				clearInterval(interval);
			}
		}, 50);

		this.setState({ onClick: true }, () => {
			this.ref.current.appendChild(TextEditor.sunEditor);
			// let editor = this.ref.current.childNodes[0].childNodes[2];
			// console.log(editor.focus());
		});
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
				<Button id="btnMove" className="iconButton" ref={this.buttonRef} variant="outline-secondary" style={cardStyle}>
					≡
				</Button>
				{!this.state.onClick ? (
					<ContentEditable
						className={`se-wrapper-wysiwyg sun-editor-editable ${style.textForm}`}
						innerRef={this.ref}
						placeholder="please enter something..."
						// disabled={true}
						html={this.state.EditList.strHtml}
						onFocus={this.onFocus}
					/>
				) : (
					<div ref={this.ref} className={style.sunEditorDiv} style={{ width: 'calc(100% - 80px)' }}></div>
				)}
				{/* <ContentEditable
					className={`se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable ${style.textForm}`}
					innerRef={this.ref}
					placeholder="please enter something..."
					disabled={true}
					html={this.state.EditList.strHtml}
					onMouseDown={this.onMouseDown}
				/> */}
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
