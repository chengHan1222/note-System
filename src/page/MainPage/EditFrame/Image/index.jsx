import React, { Component } from 'react';
import { Collapse, Space, Spin, Tag, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import style from './index.module.scss';

import UserData from '../../../../tools/UserData';

const { Panel } = Collapse;
const { Paragraph } = Typography;
const tagColor = ['red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

export default class Image extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imgWidth: 600,
			imgText: (
				<>
					<Spin /> loading...
				</>
			),
			isShowImgText: true,
		};

		this.lastX = 0;
		this.isMouseDown = false;
		this.isLeftBar = false;

		this.userContent = (
			<Space>
				<div>{this.state.imgText}</div>
			</Space>
		);

		this.changeWidth = this.changeWidth.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.getKeyWord = this.getKeyWord.bind(this);
	}
	componentDidMount() {
		document.addEventListener('mousemove', (event) => {
			// event.preventDefault();
			this.changeWidth(event);
			// event.stopPropagation();
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
		keyword = keyword
			.substring(1, keyword.length - 1)
			.replaceAll('"', '')
			.replaceAll('(', '')
			.replaceAll(')', '');
		return keyword.split(',');
	}

	render() {
		return (
			<div
				className={style.EditImage}
				style={{ width: this.state.imgWidth }}
				onDoubleClick={(event) => {
					event.preventDefault();
					this.props.openDrawBoard(true, this.props.editList.imgSrc);
				}}
			>
				<div className={style.imageBlock}>
					<div
						className={style.dragBar}
						style={{ left: '12px', height: this.state.height > 90 ? '90px' : {} }}
						onMouseDown={(event) => this.handleMouseDown(event, true)}
					></div>
					<img draggable={false} src={this.props.editList.imgSrc} className={style.Image} />
					<div className={style.dragBar} style={{ right: '12px' }} onMouseDown={(event) => this.handleMouseDown(event, false)}></div>
					<div
						className={style.arrowBlock}
						style={{ width: this.state.imgWidth * 0.05 + 'px', height: this.state.imgWidth * 0.05 + 'px' }}
						onMouseDown={(event) => {
							event.stopPropagation();
							this.setState({ isShowImgText: !this.state.isShowImgText });
						}}
					>
						<div className={style.block} style={this.state.isShowImgText ? { transform: 'rotate(180deg)' } : {}}>
							<DownOutlined />
						</div>
					</div>
				</div>

				<Paragraph className={`${style.imageText} ${this.state.isShowImgText ? style.blockDown : style.blockUp}`}>
					<blockquote>{UserData.getImgText(this.props.editList.strHtml)}</blockquote>{' '}
					{this.getKeyWord().map((element, index) => {
						if (index % 2 !== 1)
							return (
								<Tag key={'tag-' + index} color={tagColor[index % 10]}>
									{element}
								</Tag>
							);
					})}
				</Paragraph>
			</div>
		);
	}
}
