import React, { Component } from 'react';
import { Spin, Tag, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import style from './index.module.scss';

import Controller from '../../../../tools/Controller';
import EditManager from '../../../../tools/EditFrame';
import UserData from '../../../../tools/UserData';

const { Paragraph } = Typography;
const tagColor = ['red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

export default class Image extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFocus: props.isFocus,
			imgWidth: 600,
			isShowImgText: false,
			imgText: null,
		};

		this.lastX = 0;
		this.isMouseDown = false;
		this.isLeftBar = false;

		this.changeWidth = this.changeWidth.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.getKeyWord = this.getKeyWord.bind(this);
	}

	static getDerivedStateFromProps(props, state) {
		if (EditManager.focusIndex !== props.editList.sortIndex && state.isFocus) {
			return { isFocus: false };
		}
		return null;
	}

	componentDidMount() {
		document.addEventListener('mousedown', () => {
			if (this.state.isFocus) this.setState({ fisFocus: false });
		});
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Delete' || event.key === 'Backspace') {
				if (
					EditManager.lisEditList[EditManager.focusIndex] &&
					EditManager.lisEditList[EditManager.focusIndex].strHtml === this.props.editList.strHtml
				) {
					EditManager.removeItem(EditManager.focusIndex);
					UserData.deleteImg(this.props.editList.strHtml);
					Controller.removeImg(this.props.editList.strHtml);

					EditManager.focusIndex = -1;
					this.props.saveFile();
				}
			}
		});
		document.addEventListener('mousemove', (event) => {
			if (this.isMouseDown) {
				event.preventDefault();
				this.changeWidth(event);
			}
		});
		window.addEventListener('mouseup', () => (this.isMouseDown = false));
	}

	handleMouseDown(event, isLeft) {
		this.lastX = event.clientX;
		this.isMouseDown = true;
		this.isLeftBar = isLeft;
	}
	changeWidth(event) {
		if (this.isMouseDown) {
			let changeX = event.clientX - this.lastX;
			if (this.isLeftBar) changeX *= -1;
			this.setState({
				imgWidth: this.state.imgWidth < 150 ? 150 : this.state.imgWidth + changeX,
			});
			this.lastX = event.clientX;
		}
	}

	getKeyWord() {
		let keyword = UserData.getImgKeyword(this.props.editList.strHtml);
		if (keyword === '{}' || keyword === undefined) return [];
		keyword = keyword
			.substring(1, keyword.length - 1)
			.replaceAll('"', '')
			.replaceAll('(', '')
			.replaceAll(')', '');
		return keyword.split(',');
	}

	render() {
		return (
			<>
				{this.props.editList.strHtml === '<p><br></p>' ? (
					<div className={style.Loading}>
						<Spin />
					</div>
				) : (
					<div className={style.EditImage} style={{ width: this.state.imgWidth }}>
						<div
							className={style.imageBlock}
							onMouseDown={(event) => {
								event.stopPropagation();
								EditManager.focusIndex = this.props.editList.sortIndex;
								this.setState({ isFocus: true });
							}}
							onDoubleClick={(event) => {
								event.preventDefault();
								this.props.openDrawBoard(true, this.props.editList.imgSrc);
							}}
						>
							<div className={style.blueBlock} style={{ visibility: this.state.isFocus ? 'visible' : 'hidden' }}></div>
							<div
								className={style.dragBar}
								style={{ left: '12px', height: this.state.height > 90 ? '90px' : {} }}
								onMouseDown={(event) => this.handleMouseDown(event, true)}
							></div>
							<img draggable={false} alt="userImage" src={this.props.editList.imgSrc} className={style.Image} />
							<div className={style.dragBar} style={{ right: '12px' }} onMouseDown={(event) => this.handleMouseDown(event, false)}></div>
							<div
								className={style.arrowBlock}
								style={{ width: this.state.imgWidth * 0.05 + 'px', height: this.state.imgWidth * 0.05 + 'px' }}
								onMouseDown={(event) => {
									event.stopPropagation();
									this.setState({ isShowImgText: !this.state.isShowImgText, imgText: UserData.getImgText(this.props.editList.strHtml) });
								}}
							>
								<div className={style.block} style={this.state.isShowImgText ? { transform: 'rotate(180deg)' } : {}}>
									<DownOutlined />
								</div>
							</div>
						</div>

						<Paragraph strong className={`${style.imageText} ${this.state.isShowImgText ? style.blockDown : style.blockUp}`}>
							<blockquote style={{ color: UserData.darkTheme ? '#d6dce3' : '' }}>{UserData.getImgText(this.props.editList.strHtml)}</blockquote>
							{this.getKeyWord().map((element, index) => {
								if (index % 2 !== 1)
									return (
										<Tag
											key={'tag-' + index}
											color={tagColor[index % 10]}
											style={{ cursor: 'pointer' }}
											onClick={() => {
												this.props.setKeyword(element);
												EditManager.focusIndex = -1;
											}}
										>
											{element}
										</Tag>
									);
							})}
						</Paragraph>
					</div>
				)}
			</>
		);
	}
}
