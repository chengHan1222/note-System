import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './light.module.scss';
import darkmode from './dark.module.scss';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, SearchOutlined } from '@ant-design/icons';

import EditFrame from './EditFrame';
import FileManager from './FileManager';
import Loading from '../Loading';
import ToolBar from './ToolBar';
import ImgBar from './ImgBar';
import VoiceBar from './VoiceBar';

import Controller from '../../tools/Controller';
import UserData from './../../tools/UserData';
import EditManager from '../../tools/EditFrame';
import StepControl from '../../tools/StepControl';

const { Sider } = Layout;

const { useState } = React;

// const defaultData = [
// 	{
// 		title: 'folder1',
// 		key: 'folder_folder1',
// 		isLeaf: false,
// 		children: [
// 			{
// 				title: 'file1',
// 				key: 'file1',
// 				isLeaf: true,
// 				data: `[{"strHtml":"<h1>File First</h1>"},{"strHtml":"<p>List  0</p>"},{"strHtml":12,"type":"image"},{"strHtml":"<p>List  1</p>"},{"strHtml":"<p>List  2</p>"},{"strHtml":"<p>List  3</p>"},{"strHtml":"<p>List  4</p>"},{"strHtml":"<p>List  5</p>"},{"strHtml":"<p>List  6</p>"},{"strHtml":"<p>List  7</p>"},{"strHtml":"<p><strong>123</strong></p>"}]`,
// 			},
// 			{
// 				title: 'file2',
// 				key: 'file2',
// 				isLeaf: true,
// 				data: `[{"strHtml":"<h2>File Second</h2>"},{"strHtml":"<p>List  0</p>"},{"strHtml":"<p>List  1</p>"},{"strHtml":"<p>List  2</p>"},{"strHtml":"<p>List  3</p>"},{"strHtml":"<p>List  4</p>"},{"strHtml":"<p>List  5</p>"},{"strHtml":"<p>List  6</p>"},{"strHtml":"<p>List  7</p>"},{"strHtml":"<p><strong>123</strong></p>"}]`,
// 			},
// 		],
// 	},
// 	{
// 		title: 'folder2',
// 		key: 'folder_folder2',
// 		isLeaf: false,
// 		children: [
// 			{
// 				title: 'file3',
// 				key: 'file3',
// 				isLeaf: true,
// 				data: `[{"strHtml":"<h3>File Third</h3>"},{"strHtml":"<p>List  0</p>"},{"strHtml":"<p>List  1</p>"},{"strHtml":"<p>List  2</p>"},{"strHtml":"<p>List  3</p>"},{"strHtml":"<p>List  4</p>"},{"strHtml":"<p>List  5</p>"},{"strHtml":"<p>List  6</p>"},{"strHtml":"<p>List  7</p>"},{"strHtml":"<p><strong>123</strong></p>"}]`,
// 			},
// 			{
// 				title: 'file4',
// 				key: 'file4',
// 				isLeaf: true,
// 				data: `[{"strHtml":"<h4>File Fourth</h4>"}]`,
// 			},
// 		],
// 	},
// ];

const MainPage = () => {
	const [isGetData, setGetData] = useState(false);
	const navigation = useNavigate();

	const getData = () => {
		Controller.checkToken()
			.then((response) => {
				if (response && response.status === 200) {
					let data = response.data;
					UserData.setData(data.name, JSON.parse(data.data), data.email, data.uid, data.img);
					setGetData(true);
				} else {
					navigation('/');
				}
			})
			.catch(() => navigation('/'));
	};

	return isGetData ? (
		<Index />
	) : (
		<>
			<Loading />
			{getData()}
		</>
	);
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
			// files: UserData.getData()[1] !== undefined ? UserData.getData()[1] : defaultData,
			files: UserData.userFile,
			darkBtn: UserData.darkTheme,
			css: style,

			isImgBarOpened: false,
			isVoiceBarOpened: true,
			whichBar: false,
			keyword: "",
		};

		this.initial();

		this.changeStyle = this.changeStyle.bind(this);
	}
	initial() {
		setTimeout(() => {
			let focusFile = UserData.getFirstFile();
			EditManager.readFile(JSON.parse(focusFile.firstFile.data));
			StepControl.initial(EditManager.outputFile());

			this.setState({ strFocusFile: focusFile.firstFile.key });
		});
	}

	changeStyle() {
		UserData.darkTheme = !this.state.darkBtn;
		this.setState({
			darkBtn: !this.state.darkBtn,
			css: !this.state.darkBtn ? darkmode : style,
		});
	}

	setFile(data) {
		this.setState({files: data});
		UserData.store(data);
	}

	openFile(strFocusFile) {
		let data = this.state.files;
		let focusFile;
		let oldFile;

		UserData.findFile(data, this.state.strFocusFile, (item) => {
			oldFile = item;
			oldFile.data = JSON.stringify(EditManager.outputFile())
		})
		UserData.store(this.state.files);

		UserData.findFile(data, strFocusFile, (item) => {
			focusFile = item;
			if (focusFile.isLeaf === true) {
				if (focusFile.data === undefined || focusFile.data === '') {
					focusFile.data = '["<p></p>"]';
				}
	
				EditManager.readFile(JSON.parse(focusFile.data));
				StepControl.initial(EditManager.outputFile());
			};
		});
		this.setState({ strFocusFile: strFocusFile, files: data });
	}

	saveFile() {
		let data = this.state.files;
		let oldFile;

		UserData.findFile(data, this.state.strFocusFile, (item) => {
			oldFile = item;
			oldFile.data = JSON.stringify(EditManager.outputFile())
		})
		UserData.store(this.state.files);
	}

	setCollapsed(collapsed) {
		this.setState({ isCollapsed: collapsed });
	}

	setImgBarClose() {
		this.setState({ isImgBarOpened: false }, () => {
			this.setState({whichBar: false})
		});
	}

	setKeyword(keyword) {
		this.setState({isImgBarOpened: true, keyword: keyword}, () => {
			this.setState({whichBar: true})
		});
	}

	setVoiceBarClose() {
		this.setState({ isVoiceBarOpened: false }, () => {
			this.setState({whichBar: true})
		});
	}

	handleSwitchVoiceBar() {
		if (this.state.isImgBarOpened && this.state.isVoiceBarOpened) {
			this.setState({whichBar: false});
		}
	}

	handleSwitchImgBar() {
		if (this.state.isImgBarOpened && this.state.isVoiceBarOpened) {
			this.setState({whichBar: true});
		}
	}

	render() {
		return (
			<Layout id={'mainSpace'} className={this.state.css.mainPage}>
				{/* <Button
					type="primary"
					onClick={() => {
						Controller.updateDB(JSON.stringify(defaultData));
					}}
				>
					123
				</Button> */}
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
						style={this.state.darkBtn}
						changeStyle={this.changeStyle}
						openFile={this.openFile.bind(this)}
						setFile={this.setFile.bind(this)}
						isCollapsed={this.state.isCollapsed}
						setCollapsed={this.setCollapsed.bind(this)}
						// imgSrc={'https://i.pravatar.cc/300'}
					/>
				</Sider>
				<Layout
					className={this.state.css.siteLayout}
					onClick={() => this.setState({ strFocusSpace: 'EditFrame' })}
					onContextMenu={() => this.setState({ strFocusSpace: 'EditFrame' })}
				>
					
					<div className={this.state.css.layoutHeader}>
						{React.createElement(MenuUnfoldOutlined, {
							className: `${this.state.css.trigger}`,
							style: { display: this.state.isCollapsed ? '' : 'none' },
							onClick: () => this.setState({ isCollapsed: !this.state.isCollapsed }),
						})}
						<div style={{left: (!this.state.isCollapsed)? "200px": 0, width: (!this.state.isCollapsed)? "calc(100vw - 200px)": "100vw"}}>
							<ToolBar style={this.state.darkBtn} saveFile={this.saveFile.bind(this)}/>
						</div>
					</div>

					<EditFrame style={this.state.darkBtn} saveFile={this.saveFile.bind(this)} setKeyword={this.setKeyword.bind(this)} isImgBarOpened={this.state.isImgBarOpened} isVoiceBarOpened={this.state.isVoiceBarOpened}/>

					<div className={style.searchIcon} style={{display: (this.state.isImgBarOpened)? "none": ""}} >
						<SearchOutlined onClick={()=> this.setKeyword("")} className={style.searchBtn} />
					</div>
					<div className={`${style.imgBar} ${this.state.isImgBarOpened? style.appear: style.disappear}`} 
						style={(!this.state.isImgBarOpened)?
							{right: "-210px", zIndex: 4}: 
							(!this.state.whichBar)? 
								{right: "40px", top: "110px", zIndex: 4}: 
								{right: "20px", top: "100px", zIndex: 5}
							}
						onClick={() => { this.handleSwitchImgBar() }}
					>
						<ImgBar setClose={this.setImgBarClose.bind(this)} keyword={this.state.keyword}/>
					</div>
					<div className={`${style.voiceBar} ${this.state.isVoiceBarOpened? style.appear: style.disappear}`} 
						style={(!this.state.isVoiceBarOpened)?
							{right: "-210px", zIndex: 4}: 
							(this.state.whichBar)? 
								{right: "40px", top: "110px", zIndex: 4}: 
								{right: "20px", top: "100px", zIndex: 5}
							} 
						onClick={() => {this.handleSwitchVoiceBar()}}
					>
						<VoiceBar setKeyword={this.setKeyword.bind(this)} setClose={this.setVoiceBarClose.bind(this)} />
					</div>
				</Layout>
			</Layout>
		);
	}
}
