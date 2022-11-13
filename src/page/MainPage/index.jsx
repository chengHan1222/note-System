import React, { Component } from 'react';
import style from './index.module.scss';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import ToolBar from './ToolBar';
import FileManager from './FileManager';
import EditFrame from './EditFrame';

import Controller from '../../tools/Controller';
import UserData from './../../tools/UserData';
import EditManager from '../../tools/EditFrame';
import { StepControl } from '../../tools/IconFunction';

const { Sider, Header, Content } = Layout;

const { useState } = React;

const defaultData = [
	{
		title: 'folder1',
		key: 'folder_folder1',
		isLeaf: false,
		children: [
			{
				title: 'file1',
				key: 'file1',
				isLeaf: true,
				data: `["<h1>File First</h1>","<p>List  0</p>","<p>List  1</p>","<p>List  2</p>","<p>List  3</p>","<p>List  4</p>","<p>List  5</p>","<p>List  6</p>","<p>List  7</p>","<p><strong>123</strong></p>"]`,
			},
			{
				title: 'file2',
				key: 'file2',
				isLeaf: true,
				data: `["<h2>File Second</h2>","<p>List  0</p>","<p>List  1</p>","<p>List  2</p>","<p>List  3</p>","<p>List  4</p>","<p>List  5</p>","<p>List  6</p>","<p>List  7</p>","<p><strong>123</strong></p>"]`,
			},
		],
	},
	{
		title: 'folder2',
		key: 'folder_folder2',
		isLeaf: false,
		children: [
			{
				title: 'file3',
				key: 'file3',
				isLeaf: true,
				data: `["<h3>File Third</h3>","<p>List  0</p>","<p>List  1</p>","<p>List  2</p>","<p>List  3</p>","<p>List  4</p>","<p>List  5</p>","<p>List  6</p>","<p>List  7</p>","<p><strong>123</strong></p>"]`,
			},
			{
				title: 'file4',
				key: 'file4',
				isLeaf: true,
				data: `["<h4>File Fourth</h4>"]`,
			},
		],
	},
];

const MainPage = () => {
	const [isGetData, setGetData] = useState(false);

	const getData = () => {
		Controller.checkToken().then((response) => {
			if (response && response.status === 200) {
				UserData.setData(response.data.name, JSON.parse(response.data.data));
				setGetData(true);
			}
		});
	};

	return isGetData ? <Index /> : <h1>Loading {getData()}</h1>;
};

export default MainPage;

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			strTitle: UserData.getData()[0],
			strFocusFile: '',
			strFocusSpace: '',
			isCollapsed: false,
			files: UserData.getData()[1] !== undefined ? UserData.getData()[1] : defaultData,
		};

		this.initial();
	}

	initial() {
		let focusFile = UserData.getFirstFile();
		EditManager.readFile(JSON.parse(focusFile.data));
		StepControl.initial(EditManager.getFile());

		this.setState({ strFocusFile: focusFile.key });
	}

	setFile(data) {
		this.setState({ files: data });
	}

	openFile(strFocusFile) {
		let data = this.state.files;
		let focusFile;

		let findFocus = (data, key, callback) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].key === key) {
					return callback(data[i]);
				}
				if (data[i].children) {
					findFocus(data[i].children, key, callback);
				}
			}
		};

		findFocus(data, strFocusFile, (item) => {
			console.log(item);
			focusFile = item;
		});
		if (focusFile.isLeaf === true) {
			if (focusFile.data === undefined || focusFile.data === '') {
				focusFile.data = '["<p></p>"]';
			}

			EditManager.readFile(JSON.parse(focusFile.data));
			StepControl.initial(EditManager.getFile());

			this.setState({ strFocusFile: strFocusFile });
		}
	}

	setCollapsed(collapsed) {
		this.setState({ isCollapsed: collapsed });
	}

	render() {
		return (
			<Layout id={'mainSpace'} className={style.mainPage}>
				<Sider
					trigger={null}
					collapsible
					onClick={() => this.setState({ strFocusSpace: 'FileBar' })}
					onContextMenu={() => this.setState({ strFocusSpace: 'FileBar' })}
					collapsed={this.state.isCollapsed}
					collapsedWidth="0"
					breakpoint="xl"
					onBreakpoint={() => {
						this.setState({ isCollapsed: false });
					}}
					theme="light"
				>
					<FileManager
						files={this.state.files}
						focusSpace={this.state.strFocusSpace}
						title={this.state.strTitle}
						openFile={this.openFile.bind(this)}
						setFile={this.setFile.bind(this)}
						isCollapsed={this.state.isCollapsed}
						setCollapsed={this.setCollapsed.bind(this)}
						imgSrc={'https://i.pravatar.cc/300'}
					/>
				</Sider>
				<Layout
					className={style.siteLayout}
					onClick={() => this.setState({ strFocusSpace: 'EditFrame' })}
					onContextMenu={() => this.setState({ strFocusSpace: 'EditFrame' })}
				>
					<Header className={style.layoutHeader}>
						{React.createElement(MenuUnfoldOutlined, {
							className: `${style.trigger}`,
							style: { display: this.state.isCollapsed ? '' : 'none' },
							onClick: () => this.setState({ isCollapsed: !this.state.isCollapsed }),
						})}
						<ToolBar />
					</Header>
					<Content>
						<EditFrame />
					</Content>
				</Layout>
			</Layout>
		);
	}
}
