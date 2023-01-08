import React, { Component } from 'react';

import style from './light.module.scss';
import darkStyle from './dark.module.scss';
import './outSideCss.css';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Button, Card, InputGroup } from 'react-bootstrap';
import { Result } from 'antd';
import ContentEditable from 'react-contenteditable';

import DrawBoard from './DrawBoard';
import Image from './Image';

import Controller from '../../../tools/Controller';
import EditManager from '../../../tools/EditFrame';
import TextEditor, { Selector } from '../../../tools/TextEditor';
import StepControl from '../../../tools/StepControl';
import UserData from '../../../tools/UserData';

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
					TextEditor.isShow = true;
				});
			}, 50);
		};

		this.state.EditList.asynToComponent = () => {
			TextEditor.isShow = false;
			this.setState({ EditList: this.state.EditList, onFocus: false });
		};

		this.state.EditList.divRef = this.ref.current;
	}

	onFocus(event) {
		event.stopPropagation();
		EditManager.focusIndex = this.state.EditList.sortIndex;

		let interval = setInterval(() => {
			if (!TextEditor.isChanging) {
				TextEditor.isShow = true;
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
				onMouseDown={(event) => {
					event.stopPropagation();
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
					variant={UserData.darkTheme ? 'outline-light' : 'outline-secondary'}
					style={cardStyle}
				>
					≡
				</Button>
				{this.state.EditList.type === 'image' ? (
					<Image
						editList={this.state.EditList}
						openDrawBoard={this.props.openDrawBoard}
						setKeyword={this.props.setKeyword}
						saveFile={this.props.saveFile}
					/>
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

const SortableItem = SortableElement(({ EditList, sortIndex, openDrawBoard, elementStyle, setKeyword, saveFile }) => {
	document.addEventListener('keydown', (event) => {
		if (EditManager.lisEditList && EditManager.focusIndex !== -1) {
			if ((event.key === 'Delete' || event.key === 'Backspace') && !TextEditor.isShow) {
				let obj = EditManager.lisEditList[EditManager.focusIndex];

				if (obj.type === 'image') {
					UserData.deleteImg(obj.strHtml);
					Controller.removeImg(obj.strHtml);
				}

				EditManager.removeItem(EditManager.focusIndex);
				EditManager.focusIndex = -1;
				saveFile();
			} else if (EditManager.lisEditList[EditManager.focusIndex].type === 'image') {
				if (event.key === 'ArrowUp') {
					EditManager.decreaseIndex();
				} else if (event.key === 'ArrowDown') {
					EditManager.increaseIndex();
				}
			}
		}
	});
	
	return (
		<Card className={elementStyle.card}>
			<Card.Body className={elementStyle.cardBody}>
				<CardText
					EditList={EditList}
					sortIndex={sortIndex}
					openDrawBoard={openDrawBoard}
					style={elementStyle}
					setKeyword={setKeyword}
					saveFile={saveFile}
				></CardText>
			</Card.Body>
		</Card>
	);
});

const SortableList = SortableContainer(({ items, containerStyle, setKeyword, saveFile }) => {
	const [isDrawBoardShow, setDrawBoardShow] = React.useState(false);
	const [image, setImage] = React.useState('');

	const setDrawBoard = (isShow, img) => {
		setDrawBoardShow(isShow);
		setImage(img);
	};
	return (
		<div className={containerStyle.sortableList}>
			{/* <Button onClick={() => console.log(EditManager.lisEditList)}>132</Button> */}
			{items.map((EditList, index) => {
				EditList.sortIndex = index;
				return (
					<SortableItem
						key={`item-${EditList.intId}`}
						index={index}
						EditList={EditList}
						sortIndex={index}
						openDrawBoard={setDrawBoard}
						style={containerStyle}
						setKeyword={setKeyword}
						saveFile={saveFile}
					/>
				);
			})}

			<DrawBoard background={image} isOpen={isDrawBoardShow} setDrawBoardShow={setDrawBoard} />
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
		EditManager.focusIndex = newIndex;
		StepControl.addStep(EditManager.outputFile());
		this.props.saveFile();
	};

	shouldCancelStart = (event) => {
		let targetEle = event;
		if (!targetEle.id) {
			targetEle = event.target;
		}

		let returnTf = true;
		if (targetEle.id === 'btnMove') {
			returnTf = false;
		}
		return returnTf;
	};

	render() {
		return (
			<SortableList
				items={this.state.items}
				style={this.props.style}
				setKeyword={this.props.setKeyword}
				saveFile={this.props.saveFile}
				onSortEnd={this.onSortEnd}
				axis="xy"
				shouldCancelStart={this.shouldCancelStart}
			/>
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
			<div
				className={this.state.css.editFrame}
				id={'editFrame_imgBaruse'}
				style={{ paddingRight: this.props.isImgBarOpened || this.props.isVoiceBarOpened ? '220px' : 0 }}
			>
				{EditManager.lisEditList.length === 0 ? (
					<div className={this.state.css.fileEmpty}>
						<Result
							status="error"
							title={<div style={{ color: UserData.darkTheme ? '#f7f2ec' : '' }}>File is not Find</div>}
							subTitle={<div style={{ color: UserData.darkTheme ? '#f7f2ec' : '' }}>Please choose other file to continue.</div>}
						/>
					</div>
				) : (
					<SortableComponent style={this.state.css} saveFile={this.props.saveFile} setKeyword={this.props.setKeyword} />
				)}
			</div>
		);
	}
}
