import { Avatar, Button, Card, Divider, Popover, Space, Switch, Tree } from 'antd';
import { ArrowLeftOutlined, DownOutlined, FileAddOutlined, FolderAddOutlined, DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

import 'antd/dist/antd.css';
import Swal from 'sweetalert2';

import RightClickBlock from './rightClickBlock';

import UserData from '../../../tools/UserData';
import Controller from '../../../tools/Controller';
import EditManager from '../../../tools/EditFrame';

import styled from 'styled-components';

const FileBlock = styled.div`
	background-color: ${(props) => (props.isDark ? '#002329' : '#ffc069')};

	& .userBlock {
		width: 100%;
		height: 40px;
		padding: 15px 0 0 5px;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		user-select: none;

		& .userInfo {
			cursor: pointer;

			& .userHead {
				margin-top: 5px;
				margin-left: 10px;
			}
		}

		& .backArrow {
			width: 30px;
			height: 30px;
			color: ${(props) => (props.isDark ? '#f7f2ec' : '')};
			font-size: 18px;
			align-items: center;
			display: flex;
			margin-right: 0;
		}
	}

	& .divider {
		background-color: ${(props) => (props.isDark ? '#1b555f' : '')};
		margin: 0 auto;
		margin-top: 5px;
		margin-bottom: 10px;
	}

	& .titleName {
		display: flex;
		align-items: center;
		font-size: 20px;
		margin: 0 auto;
		margin-top: 5px;
		padding-left: 5px;
		color: ${(props) => (props.isDark ? '#dee2e6' : '#612500')};

		width: 100%;

		overflow: hidden;
		white-space: nowrap;
	}

	& .container {
		height: 100vh;
		width: 100%;
		background-color: ${(props) => (props.isDark ? '#002329' : '#ffc069')} !important;
	}

	.ant-btn {
		color: ${(props) => (props.isDark ? '#f7f2ec' : '')} !important;
		background-color: transparent !important;
		border: none !important;
		margin-top: 3px !important;

		&:hover {
			color: #69b1ff !important;
		}
	}

	.ant-tree-treenode {
		color: ${(props) => (props.isDark ? '#f7f2ec' : 'black')} !important;
	}

	.ant-tree-switcher {
		margin-top: -3px !important;
		background-color: transparent !important;
	}

	.ant-tree-node-content-wrapper {
		outline: none !important;
		border: 1px solid transparent;
	}
	.ant-tree-node-content-wrapper:hover {
		background-color: ${(props) => (props.isDark ? 'rgba(0, 109, 117, 0.6)' : 'rgba(85, 94, 98, 0.6)')} !important;
	}

	.ant-tree-node-selected {
		color: white !important;
		background-color: ${(props) => (props.isDark ? '#006d75' : 'rgb(85, 94, 98)')} !important;
		border: 1px solid ${(props) => (props.isDark ? '#00474f' : 'blue')} !important;
	}
	.ant-tree-node-selected:hover {
		background-color: ${(props) => (props.isDark ? '#006d75' : 'rgb(85, 94, 98)')} !important;
	}

	.naming {
		outline: none !important;
		border: 1px solid yellow !important;
	}

	.ant-popover-inner-content {
		padding: 0 !important;
	}
`;

const { Meta } = Card;

const FileManager = (props) => {
	const navigation = useNavigate();

	return <Index {...props} navigation={navigation} />;
};

export default FileManager;

class Index extends Component {
	rightClickBlockFunctions = {
		rename: () => {
			this.setState({ booRCBVisible: false }, () => {
				this.rename();
			});
		},
		addFile: () => {
			this.setState({ booRCBVisible: false }, () => {
				this.addFile();
			});
		},
		addFolder: () => {
			this.setState({ booRCBVisible: false }, () => {
				this.addFolder();
			});
		},
		delete: () => {
			this.setState({ booRCBVisible: false }, () => {
				this.delete();
			});
		},
	};
	insert = false;
	oldKey = '';
	isAddNewFile = false;
	constructor(props) {
		super(props);
		this.state = {
			gData: props.files,
			expandedKeys: [],
			selectedKeys: [],
			draggable: { icon: false },

			isNaming: false,
			fileName: '',

			intX: 0,
			intY: 0,
			booRCBVisible: false,
			namingNode: '',

			finishNaming: this.finishNaming,
		};
		this.userData = UserData.getData();
		this.userPic = React.createRef();
		this.switchRef = React.createRef();
		this.imgSrc = 'https://joeschmoe.io/api/v1/random';
		this.userContent = (isDark) => (
			<Card
				style={{ width: 300, userSelect: 'none' }}
				actions={[
					<Space onClick={() => this.switchRef.current.click()}>
						<span>變更主題</span>
						<Switch
							ref={this.switchRef}
							loading={this.state.isRunning ? true : false}
							defaultChecked={UserData.darkTheme}
							style={{
								backgroundColor: isDark ? '#006d75' : '#fa8c16',
								fontWeight: 'bold',
							}}
							checkedChildren="DARK"
							unCheckedChildren="LIGHT"
							onChange={() => {
								this.props.changeStyle();
								this.setState({ isRunning: true });
								setTimeout(() => this.setState({ isRunning: false }), 500);
							}}
						/>
					</Space>,
					<Space
						style={{ width: '100%', justifyContent: 'center' }}
						onClick={() => {
							Controller.logout();
							this.props.navigation('/');
						}}
					>
						<LogoutOutlined style={{ verticalAlign: 'middle' }} />
						<span>登出</span>
					</Space>,
				]}
			>
				<Meta
					avatar={
						<Avatar
							size={48}
							style={{
								backgroundColor: '#00a2ae',
								verticalAlign: 'middle',
							}}
						>
							{this.userData[0].split('')[0].toUpperCase()}
						</Avatar>
					}
					title={this.userData[0]}
					description={this.userData[2]}
				/>
			</Card>
		);

		this.initial();
	}

	static getDerivedStateFromProps(props, state) {
		if (props.focusSpace === 'EditFrame') {
			if (state.isNaming) state.finishNaming();
			return { booRCBVisible: false };
		} else if (props.files !== state.gData) {
			props.setFile(state.gData);
		}
		return {};
	}

	initial = () => {
		setTimeout(() => {
			let focusFile = UserData.getFirstFile();
			this.setState({
				selectedKeys: [focusFile.firstFile.key],
				expandedKeys: focusFile.parents,
			});
		});
	};

	finishNaming = () => {
		let tree = [...this.state.gData];
		let focusKey = this.state.selectedKeys[0];
		let fileName = this.state.fileName;
		let expandedKeys = this.state.expandedKeys;
		let enable = true;
		let focusItem;

		const checkEnable = (data, checkedFileName, isLeaf, callback) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].title === checkedFileName && data[i].isLeaf === isLeaf) {
					return callback(false, i);
				}
				if (data[i].children) {
					checkEnable(data[i].children, checkedFileName, isLeaf, callback);
				}
			}
		};

		const setNodeNormal = () => {
			let namingNode = this.state.namingNode;

			namingNode.contentEditable = 'inherit';
			namingNode.classList.remove('naming');
			namingNode.removeEventListener('keydown', this.onKeyDown);
		};

		if (fileName === '') {
			this.delete();
			return;
		}
		if (focusKey !== undefined) {
			this.findFocus(tree, focusKey, (item, index) => {
				focusItem = item;

				checkEnable(tree, fileName, focusItem.isLeaf, (result, i) => {
					if (!result && index !== i) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: '名稱重複',
							showConfirmButton: false,
							timer: 1500,
						});
						enable = result;

						if (this.oldKey !== '') {
							let oldTitle = focusItem.isLeaf ? this.oldKey : this.oldKey.split('_')[1];

							this.setState({ isNaming: false }, () => {
								setNodeNormal();
								this.setDragable(true);
								this.state.namingNode.innerText = oldTitle;
								this.oldKey = '';
							});
						} else {
							this.delete();
							this.setState({ isNaming: false });
						}
					}
				});
			});
			if (enable && this.state.isNaming) {
				let key = focusItem.isLeaf ? fileName : 'folder_' + fileName;
				if (!focusItem.isLeaf && expandedKeys.includes(this.oldKey)) {
					expandedKeys = expandedKeys.filter((item) => item !== this.oldKey);
					expandedKeys = [...expandedKeys, key];
				}

				focusItem.title = fileName;
				focusItem.key = key;

				this.setState({ gData: tree, selectedKeys: [key], isNaming: false, expandedKeys: expandedKeys, fileName: '' }, () => {
					setNodeNormal();
					this.setDragable(true);
				});

				if (this.isAddNewFile) {
					this.isAddNewFile = false;
					this.props.openFile(focusItem.key);
				}
			}
		}
	};

	rename = () => {
		if (!this.state.isNaming) {
			let selected = this.state.selectedKeys[0];
			this.oldKey = selected;
			selected = selected.includes('_') ? selected.split('_')[1] : selected;
			this.setState({ isNaming: true, fileName: selected }, () => {
				this.insert = true;
				this.setNodeNaming(selected);
				this.setDragable(false);
			});
		}
	};

	addFile = () => {
		if (!this.state.isNaming) {
			let node = { title: '', key: '', isLeaf: true, data: `[{"strHtml":"<h2>This is a new Page.</h2>"},{"strHtml":"<p><br></p>"}]` };
			this.insertNode(node);
			this.setState({ isNaming: true, selectedKeys: [''], fileName: '' }, () => {
				this.isAddNewFile = true;
				this.setNodeNaming('');
				this.setDragable(false);
				this.isAddNewFile = true;
			});
		}
	};

	addFolder = () => {
		if (!this.state.isNaming) {
			let node = { title: '', key: '', isLeaf: false, children: [] };
			this.insertNode(node);
			this.setState({ isNaming: true, selectedKeys: [''], fileName: '' }, () => {
				this.setNodeNaming('');
				this.setDragable(false);
			});
		}
	};

	setDragable = (enable) => {
		this.setState({ draggable: enable ? { icon: false } : false });
	};

	insertNode = (node) => {
		let data = [...this.state.gData];
		let focusKey = this.state.selectedKeys[0];
		let expandedKeys = this.state.expandedKeys;
		let insertSpace;
		if (focusKey !== undefined) {
			this.findFocus(data, focusKey, (item, i, arr) => {
				insertSpace = !item.isLeaf ? item.children : arr;
				insertSpace.unshift(node);
				if (item.isLeaf === false && !expandedKeys.includes(item.key)) {
					this.setState({ expandedKeys: [...expandedKeys, item.key] });
					setTimeout(() => {
						this.insert = true;
					}, 250);
				} else {
					this.insert = true;
				}
			});
			this.setState({ gData: data });
		} else {
			data.unshift(node);
			this.insert = true;

			this.setState({ gData: data });
		}
	};

	setNodeNaming = (nodeKey) => {
		nodeKey = nodeKey.includes('_') ? nodeKey.split('_')[1] : nodeKey;
		let nodes = document.getElementsByClassName('ant-tree-node-content-wrapper');
		let setNode = setInterval(() => {
			if (this.insert) {
				for (let i = 0; i < nodes.length; i++) {
					if (nodes[i].title === nodeKey) {
						nodes[i].contentEditable = true;
						nodes[i].classList.add('naming');
						nodes[i].addEventListener('keydown', this.onKeyDown);
						this.setState({ namingNode: nodes[i] });
					}
				}
				this.insert = false;
				clearInterval(setNode);
			}
		}, 100);
	};

	delete = () => {
		let data = [...this.state.gData];
		let focusKey = this.state.selectedKeys[0];
		if (focusKey !== undefined) {
			this.findFocus(data, focusKey, (item, i, arr) => {
				arr.splice(i, 1);
			});

			this.setState({ gData: data, selectedKeys: [], isNaming: false });
		}

		EditManager.removeFile();
	};

	findFocus = (data, key, callback) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].key === key) {
				return callback(data[i], i, data);
			}

			if (data[i].children) {
				this.findFocus(data[i].children, key, callback);
			}
		}
	};

	onKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.finishNaming();
		} else {
			setTimeout(() => {
				this.setState({ fileName: event.target.innerText });
			});
		}
	};

	onRightClick = (event) => {
		event.preventDefault();
		let target = event.target;

		const findFocus = (findTarget, callback) => {
			if (findTarget.classList.contains('ant-tree-node-content-wrapper-open') || findTarget.classList.contains('ant-tree-node-content-wrapper-close')) {
				return callback('folder_' + findTarget.title);
			} else if (findTarget.classList.contains('ant-tree-node-content-wrapper-normal')) {
				return callback(findTarget.title);
			} else if (!findTarget.classList.contains('ant-tree-treenode')) {
				findFocus(findTarget.parentNode, callback);
			}
		};

		findFocus(target, (item) => {
			this.setState({
				intX: event.pageX,
				intY: event.pageY,
				booRCBVisible: true,
				selectedKeys: [item],
			});
		});
	};

	onClick = (event) => {
		if (this.state.isNaming && !this.state.isError) {
			if (!event.target.className.includes('ant-tree-node-content-wrapper')) {
				this.finishNaming();
			}
		} else if (this.state.booRCBVisible) {
			this.setState({ booRCBVisible: false });
		}
	};

	onSelect = (keys, event) => {
		const selectedKeys = this.state.selectedKeys;
		const expandedKeys = this.state.expandedKeys;

		let refreshExpand = (key) => {
			if (!expandedKeys.includes(key)) {
				this.setState({ expandedKeys: [...expandedKeys, key] });
			} else {
				let array = expandedKeys.filter((value) => {
					return value !== key;
				});
				this.setState({ expandedKeys: array });
			}
		};
		if (event.nativeEvent.detail === 1 && !this.state.isNaming) {
			if (event.nativeEvent.ctrlKey) this.setState({ selectedKeys: keys });
			else if (selectedKeys !== [] && selectedKeys.length > keys.length) {
				for (let i = 0; i < selectedKeys.length; i++) {
					if (selectedKeys[i] !== keys[i]) {
						this.setState({ selectedKeys: [selectedKeys[i]] });
						refreshExpand(selectedKeys[i]);
						return;
					}
				}
			} else {
				this.setState({ selectedKeys: keys.slice(-1) });
				refreshExpand(keys.slice(-1)[0]);
			}
		} else if (event.nativeEvent.detail === 2 && !this.state.isNaming) {
			this.props.openFile(this.state.selectedKeys[0]);
		}
	};

	onDrop = (info) => {
		const dropKey = info.node.key;
		const dragKey = info.dragNode.key;
		const dropPos = info.node.pos.split('-');
		const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

		const data = [...this.state.gData]; // Find dragObject

		let dragObj;
		this.findFocus(data, dragKey, (item, index, arr) => {
			arr.splice(index, 1);
			dragObj = item;
		});
		if (!info.dropToGap) {
			// Drop on the content
			this.findFocus(data, dropKey, (item, i, arr) => {
				if (item.isLeaf) {
					arr.unshift(dragObj);
				} else {
					item.children.unshift(dragObj);
				}
			});
		} else if (
			(info.node.props.children || []).length > 0 && // Has children
			info.node.props.expanded && // Is expanded
			dropPosition === 1 // On the bottom gap
		) {
			this.findFocus(data, dropKey, (item) => {
				item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

				item.children.unshift(dragObj); // in previous version, we use item.children.push(dragObj) to insert the
				// item to the tail of the children
			});
		} else {
			let ar = [];
			let i;
			this.findFocus(data, dropKey, (_item, index, arr) => {
				ar = arr;
				i = index;
			});

			if (dropPosition === -1) {
				ar.splice(i, 0, dragObj);
			} else {
				ar.splice(i + 1, 0, dragObj);
			}
		}

		this.setState({ gData: data });
	};

	render() {
		return (
			<FileBlock id={'fileBar'} isDark={UserData.darkTheme} onClick={this.onClick}>
				<Space className="userBlock">
					<Popover placement="bottomLeft" content={this.userContent(UserData.darkTheme)} trigger={['click']}>
						<Space className="userInfo">
							<Avatar
								ref={this.userPic}
								className="userHead"
								style={{
									backgroundColor: '#00a2ae',
								}}
							>
								{this.userData[0].split('')[0].toUpperCase()}
							</Avatar>
							<span className="titleName">{this.userData[0]} 你好</span>
						</Space>
					</Popover>

					{React.createElement(ArrowLeftOutlined, {
						className: 'backArrow',
						onClick: () => this.props.setCollapsed(!this.props.isCollapsed),
					})}
				</Space>
				<Space size={1} style={{ width: '100%', justifyContent: 'end' }}>
					<Button icon={<FileAddOutlined />} onClick={this.addFile} />
					<Button icon={<FolderAddOutlined />} onClick={this.addFolder} />
					<Button icon={<DeleteOutlined />} onClick={this.delete} />
				</Space>
				<Divider className="divider" />
				<Tree
					style={{ marginLeft:'10px',fontSize: '16px' }}
					multiple
					blockNode
					showLine={true}
					showIcon={false}
					draggable={this.state.draggable}
					rootClassName="container"
					switcherIcon={<DownOutlined />}
					treeData={this.state.gData}
					selectedKeys={this.state.selectedKeys}
					onSelect={this.onSelect}
					expandedKeys={this.state.expandedKeys}
					onExpand={(keys) => {
						this.setState({ expandedKeys: keys });
					}}
					onDrop={this.onDrop}
					onContextMenu={this.onRightClick.bind(this)}
				/>
				<RightClickBlock
					style={this.props.style}
					x={this.state.intX}
					y={this.state.intY}
					show={this.state.booRCBVisible}
					functions={this.rightClickBlockFunctions}
					isSelect={this.state.selectedKeys[0]}
					data={this.state.gData}
					findFocus={this.findFocus}
				/>
			</FileBlock>
		);
	}
}
