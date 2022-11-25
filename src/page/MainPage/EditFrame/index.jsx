import React, { Component } from 'react';

import style from './light.module.scss';
import darkStyle from './dark.module.scss';
import './outSideCss.css';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import { arrayMoveImmutable } from 'array-move';
import { Button, Card, InputGroup } from 'react-bootstrap';
import ContentEditable from 'react-contenteditable';

import DrawBoard from './DrawBoard';
import Image from './Image';

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
		if (this.state.EditList.type === 'image') return;

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
			this.setState({ EditList: this.state.EditList, onFocus: false });
		};

		this.state.EditList.divRef = this.ref.current;
	}

	onFocus(event) {
		event.stopPropagation();

		// EditManager.focusList = this.state.EditList;
		EditManager.focusIndex = this.state.EditList.sortIndex;

		let interval = setInterval(() => {
			if (!TextEditor.isChanging) {
				TextEditor.setSunEditorHTML(this.state.EditList.strHtml);
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
				onMouseDown={() => {
					EditManager.focusIndex = this.state.EditList.sortIndex;
				}}
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
					onMouseDown={() => {
						// console.log(this.state.EditList.sortIndex);
					}}
				>
					≡
				</Button>
				{this.state.EditList.type === 'image' ? (
					<Image src={this.state.EditList.imgSrc} openDrawBoard={this.props.openDrawBoard} />
				) : !this.state.onFocus ? (
					<ContentEditable
						className={`se-wrapper-wysiwyg sun-editor-editable ${this.props.style.textForm}`}
						innerRef={this.ref}
						placeholder="please enter something..."
						html={this.state.EditList.strHtml}
						onFocus={this.onFocus}
					/>
				) : (
					<div ref={this.ref} className={this.props.style.sunEditorDiv} style={{ width: 'calc(100% - 80px)' }}></div>
				)}
			</InputGroup>
		);
	}
}

const SortableItem = SortableElement(({ EditList, sortIndex, openDrawBoard, style }) => {
	document.addEventListener('keydown', (e) => {
		if (EditManager.lisEditList && EditManager.focusIndex !== -1 && EditManager.lisEditList[EditManager.focusIndex].type === 'image') {
			if (e.key === 'ArrowUp') {
				EditManager.decreaseIndex();
			} else if (e.key === 'ArrowDown') {
				EditManager.increaseIndex();
			}
		}
	});

	return (
		<Card className={style.card}>
			<Card.Body className={style.cardBody}>
				<CardText EditList={EditList} sortIndex={sortIndex} openDrawBoard={openDrawBoard} style={style}></CardText>
			</Card.Body>
		</Card>
	);
});

const SortableList = SortableContainer(({ items, style }) => {
	const [isDrawBoardShow, setDrawBoardShow] = React.useState(false);
	const [image, setImage] = React.useState('');

	const setDrawBoard = (isShow, img) => {
		setDrawBoardShow(isShow);
		setImage(img);
	};
	return (
		<div className={style.sortableList}>
			{/* <Button onClick={() => console.log(UserData.getImgData(12))}>132</Button> */}
			{items.map((EditList, index) => {
				EditList.sortIndex = index;
				return (
					<SortableItem
						key={`item-${EditList.intId}`}
						index={index}
						EditList={EditList}
						sortIndex={index}
						openDrawBoard={setDrawBoard}
						style={style}
					/>
				);
			})}

			<DrawBoard background={image} isOpen={isDrawBoardShow} setDrawBoardShow={setDrawBoard} />
		</div>
	);
});

class SortableComponent extends Component {
	constructor(props) {
		super(props);
	}
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
		EditManager.focusIndex = newIndex;
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
					style={this.props.style}
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
		this.state = {
			css: props.style ? darkStyle : style,
		};
	}

	static getDerivedStateFromProps(props) {
		return {
			css: props.style ? darkStyle : style,
		};
	}
	render() {
		return (
			<div className={this.state.css.editFrame}>
				<SortableComponent style={this.state.css} />
			</div>
		);
	}
}
