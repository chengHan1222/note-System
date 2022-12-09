import React from 'react';
import style from './index.module.scss';
import './index.css';
import { Tag, Button, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Recorder from './Recorder';

import EditManager from '../../../tools/EditFrame';

const { useEffect, useState } = React;

const VoiceBar = (props) => {
	const [title, setTitle] = useState();
	const [content, setContent] = useState();
	const [keyword, setKeyword] = useState();

	const tagColor = ['red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

	useEffect(() => {
		setRecordContent(props.content.title, props.content.text, props.content.keyword);
	}, [props.content]);

	const setRecordContent = (title, content, keyword) => {
		setTitle(title);
		setContent(content);
		setKeyword(keyword);
	};

	const getKeyWord = () => {
		if (keyword === undefined || keyword.length === 0) return [];
		return keyword;
	};

	return (
		<>
			<div style={{ margin: '10px 20px' }}>
				<Button
					shape="circle"
					icon={<CloseOutlined className={style.voiceBarBtn} />}
					className={style.voiceBarBtnspace}
					onClick={() => {
						props.setVoiceBar(false);
					}}
				/>
				<p className={style.fileName}>{title ? title : 'filesname'}</p>
			</div>
			<Divider style={{ borderWidth: '2px', marginTop: 0, marginBottom: '20px', borderColor: 'rgb(0 0 0 / 13%)' }} />
			<div className={style.voiceBar_p}>{content}</div>
			{getKeyWord().map((element, index) => {
				return (
					<Tag
						key={'voiceTag-' + index}
						color={tagColor[index % 10]}
						style={{ cursor: 'pointer', marginBottom: '1px' }}
						onClick={() => {
							props.setKeyword(element[0]);
							EditManager.focusIndex = -1;
						}}
					>
						{element[0]}
					</Tag>
				);
			})}
			<footer className={style.footer}>
				<div className={style.relative}>
					<Divider style={{ borderWidth: '2px', marginTop: 0, marginBottom: '10px', borderColor: 'rgb(0 0 0 / 13%)' }} />
					<Recorder setRecordContent={setRecordContent} />
				</div>
			</footer>
		</>
	);
};

export default VoiceBar;
