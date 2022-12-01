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

	componentDidMount() {
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Delete' || event.key === 'Backspace') {
				// console.log(EditManager.lisEditList[EditManager.focusIndex].strHtml);
				if (EditManager.lisEditList[EditManager.focusIndex].strHtml === this.props.imgId) {
					EditManager.removeItem(EditManager.focusIndex);
					Controller.removeImg(this.props.imgId);
					EditManager.focusIndex = -1;
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
		let keyword = UserData.getImgKeyword(this.props.imgId);
		if (keyword === '{}' || keyword === undefined) return;
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
				{this.props.imgId === '<p><br></p>' ? (
					<div className={style.Loading}>
						<Spin />
					</div>
				) : (
					<div
						className={style.EditImage}
						style={{ width: this.state.imgWidth }}
						onDoubleClick={(event) => {
							event.preventDefault();
							this.props.openDrawBoard(true, UserData.getImgData(this.props.imgId));
						}}
					>
						<div className={style.imageBlock}>
							<div
								className={style.dragBar}
								style={{ left: '12px', height: this.state.height > 90 ? '90px' : {} }}
								onMouseDown={(event) => this.handleMouseDown(event, true)}
							></div>
							<img draggable={false} src={UserData.getImgData(this.props.imgId)} className={style.Image} />
							<div className={style.dragBar} style={{ right: '12px' }} onMouseDown={(event) => this.handleMouseDown(event, false)}></div>
							<div
								className={style.arrowBlock}
								style={{ width: this.state.imgWidth * 0.05 + 'px', height: this.state.imgWidth * 0.05 + 'px' }}
								onMouseDown={(event) => {
									event.stopPropagation();
									this.setState({ isShowImgText: !this.state.isShowImgText, imgText: UserData.getImgText(this.props.imgId) });
								}}
							>
								<div className={style.block} style={this.state.isShowImgText ? { transform: 'rotate(180deg)' } : {}}>
									<DownOutlined />
								</div>
							</div>
						</div>

						<Paragraph strong className={`${style.imageText} ${this.state.isShowImgText ? style.blockDown : style.blockUp}`}>
							<blockquote style={{ color: UserData.darkTheme ? '#d6dce3' : '' }}>{UserData.getImgText(this.props.imgId)}</blockquote>
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
