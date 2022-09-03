import React, { Component } from 'react';
import style from './index.module.scss';

import Button from 'react-bootstrap/Button';
import ContentEditable from 'react-contenteditable';

import { Selector } from '../../tools/TextEditor';

export default class test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: '<p>123<b>555555</b>888888</p>',
		};

		this.changeStyle = this.changeStyle.bind(this);
	}

	changeStyle(style) {
		if (Selector.selector.rangeCount) {
			let content = this.state.content;
			console.log(Selector.selector);
			let splitContent = content.split(Selector.selector.toString());
			let newContent = splitContent[0] + `<span className='${style}'>${Selector.selector.toString()}</span>` + splitContent[1];
			console.log(newContent)
			// Creates a new element, and insert the selected text with the chosen style
			// var e = document.createElement('span');
			// e.classList.add(style); // Selected style (class)
			// e.innerHTML = sel.toString(); // Selected text
			this.setState({ content: newContent });

			// https://developer.mozilla.org/en-US/docs/Web/API/Selection/getRangeAt
			var range = Selector.selector.getRangeAt(0);
			range.deleteContents(); // Deletes selected text…
			// range.insertNode(e); // … and inserts the new element at its place
		}
	}

	render() {
		return (
			<>
				<div className={style.IconButton}>
					<button
						onClick={() => {
							this.changeStyle('span-b');
						}}
					>
						<i className="fa-solid fa-b"></i>
					</button>

					<Button
						onClick={() => {
							console.log(Selector.selector);
							console.log(Selector.selector.toString());
						}}
					>
						console
					</Button>
					<Button
						onClick={() => {
							Selector.getRan();
						}}
					>
						range
					</Button>
				</div>

				<ContentEditable className={style.Editor} html={this.state.content} />
			</>
		);
	}
}
