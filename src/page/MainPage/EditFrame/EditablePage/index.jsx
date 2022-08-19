import React, { Component } from 'react';

import style from './index.module.scss';

import SelectMenu from './SelectMenu';
import ContentEditable from 'react-contenteditable';

const uid = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// const initialBlock = { id: uid(), html: '123', tag: 'p' };

const setCaretToEnd = (element) => {
	const range = document.createRange();
	const selection = window.getSelection();
	range.selectNodeContents(element);
	range.collapse(false);
	selection.removeAllRanges();
	selection.addRange(range);
	element.focus();
};

export default class EditablePage extends Component {
	constructor(props) {
		super(props);
		this.updatePageHandler = this.updatePageHandler.bind(this);
		this.addBlockHandler = this.addBlockHandler.bind(this);
		this.deleteBlockHandler = this.deleteBlockHandler.bind(this);
		this.state = { blocks: [{ id: uid(), html: this.props.html, tag: 'p' }] };
	}

	updatePageHandler(updatedBlock) {
		const blocks = this.state.blocks;
		const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
		const updatedBlocks = [...blocks];
		updatedBlocks[index] = {
			...updatedBlocks[index],
			tag: updatedBlock.tag,
			html: updatedBlock.html,
		};
		this.setState({ blocks: updatedBlocks });
	}

	addBlockHandler(currentBlock) {
		const newBlock = { id: uid(), html: '', tag: 'p' };
		const blocks = this.state.blocks;
		const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
		const updatedBlocks = [...blocks];
		updatedBlocks.splice(index + 1, 0, newBlock);
		this.setState({ blocks: updatedBlocks }, () => {
			currentBlock.ref.nextElementSibling.focus();
		});
	}

	deleteBlockHandler(currentBlock) {
		const previousBlock = currentBlock.ref.previousElementSibling;
		if (previousBlock) {
			const blocks = this.state.blocks;
			const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
			const updatedBlocks = [...blocks];
			updatedBlocks.splice(index, 1);
			this.setState({ blocks: updatedBlocks }, () => {
				setCaretToEnd(previousBlock);
				previousBlock.focus();
			});
		}
	}

	render() {
		return (
			<div className={style.page}>
				{this.state.blocks.map((block, key) => {
					return (
						<EditableBlock
							key={key}
							id={block.id}
							tag={block.tag}
							html={block.html}
							updatePage={this.updatePageHandler}
							addBlock={this.addBlockHandler}
							deleteBlock={this.deleteBlockHandler}
						/>
					);
				})}
			</div>
		);
	}
}

export class EditableBlock extends Component {
	constructor(props) {
		super(props);

		this.state = {
			htmlBackup: null,
			html: '',
			tag: 'p',
			previousKey: '',
			selectMenuIsOpen: false,
			selectMenuPosition: {
				x: null,
				y: null,
			},
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
		this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
		this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this);
		this.closeSelectMenuHandler = this.closeSelectMenuHandler.bind(this);
		this.tagSelectionHandler = this.tagSelectionHandler.bind(this);
		this.contentEditable = React.createRef();
	}

	componentDidMount() {
		this.setState({ html: this.props.html, tag: this.props.tag });
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.html !== this.props.html) {
			this.setState({html: this.props.html})
			return;
		}
		console.log('-----');
		const htmlChanged = prevState.html !== this.state.html;
		const tagChanged = prevState.tag !== this.state.tag;
		if (htmlChanged || tagChanged) {
			this.props.updatePage({
				id: this.props.id,
				html: this.state.html,
				tag: this.state.tag,
			});
		}
	}

	onChangeHandler(event) {
		this.setState({ html: event.target.value });
	}

	onKeyUpHandler(e) {
		if (e.key === '/') {
			this.openSelectMenuHandler();
		}
	}

	onKeyDownHandler(event) {
		if (event.key === '/') {
			this.setState({ htmlBackup: this.state.html });
		}
		if (event.key === 'Enter') {
			if (!event.shiftKey) {
				event.preventDefault();
				this.props.addBlock();
			}
		}
		if (event.key === 'Backspace' && !this.state.html) {
			event.preventDefault();
			this.props.deleteBlock();
		}
		this.setState({ previousKey: event.key });
	}

	openSelectMenuHandler() {
		const { x, y } = getCaretCoordinates();
		this.setState({
			selectMenuIsOpen: true,
			selectMenuPosition: { x, y },
		});
		document.addEventListener('click', this.closeSelectMenuHandler);
	}

	closeSelectMenuHandler() {
		this.setState({
			htmlBackup: null,
			selectMenuIsOpen: false,
			selectMenuPosition: { x: null, y: null },
		});
		document.removeEventListener('click', this.closeSelectMenuHandler);
	}

	tagSelectionHandler(tag) {
		this.setState({ tag: tag, html: this.state.htmlBackup }, () => {
			setCaretToEnd(this.contentEditable.current);
			this.closeSelectMenuHandler();
		});
	}

	render() {
		return (
			<>
				{this.state.selectMenuIsOpen && (
					<SelectMenu
						position={this.state.selectMenuPosition}
						onSelect={this.tagSelectionHandler}
						close={this.closeSelectMenuHandler}
					/>
				)}
				<ContentEditable
					className={style.block}
					innerRef={this.contentEditable}
					html={this.state.html}
					tagName={this.state.tag}
					onChange={this.onChangeHandler}
					onKeyDown={this.onKeyDownHandler}
					onKeyUp={this.onKeyUpHandler}
				/>
			</>
		);
	}
}

const getCaretCoordinates = () => {
	let x, y;
	const selection = window.getSelection();
	if (selection.rangeCount !== 0) {
		const range = selection.getRangeAt(0).cloneRange();
		range.collapse(false);
		const rect = range.getClientRects()[0];
		if (rect) {
			x = rect.left - 230;
			y = rect.top;
		}
	}
	return { x, y };
};
