import React, { Component } from 'react';

import style from './index.module.scss';

import ContentEditable from 'react-contenteditable';

const uid = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const initialBlock = { id: uid(), html: '', tag: 'p' };

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
		this.state = { blocks: [initialBlock] };
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
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
		this.contentEditable = React.createRef();
	}

	componentDidMount() {
		this.setState({ html: this.props.html, tag: this.props.tag });
	}

	componentDidUpdate(prevProps, prevState) {
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

	onKeyDownHandler(e) {
		if (e.key === '/') {
			this.setState({ htmlBackup: this.state.html });
		}
		if (e.key === 'Enter') {
			if (this.state.previousKey !== 'Shift') {
				e.preventDefault();
				this.props.addBlock({
					id: this.props.id,
					ref: this.contentEditable.current,
				});
			}
		}
		if (e.key === 'Backspace' && !this.state.html) {
			e.preventDefault();
			this.props.deleteBlock({
				id: this.props.id,
				ref: this.contentEditable.current,
			});
		}
		this.setState({ previousKey: e.key });
	}

	render() {
		return (
			<ContentEditable
				className={style.block}
				innerRef={this.contentEditable}
				html={this.state.html}
				tagName={this.state.tag}
				onChange={this.onChangeHandler}
			/>
		);
	}
}
