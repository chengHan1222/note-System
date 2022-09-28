import { Tree, Button, Space, Modal, Input, Divider } from 'antd';
import {
    DownOutlined,
    FileAddOutlined,
    FolderAddOutlined,
    DeleteOutlined,
  } from '@ant-design/icons';
import React from 'react';
import style from './index.module.scss';
import 'antd/dist/antd.css';
import FileRightClickBlock from './fileRightClickBlock';


class FileManager extends React.Component {

    rightClickBlockFunctions = {
		rename: () => {
			this.setState({booRCBVisible: false}, 
				() => {
					this.rename();
				}
			);
		}, 
		addFile: () => {
			this.setState({booRCBVisible: false}, 
                () => {
                    this.addFile();
                }
            );
		},
        addFolder: () => {
            this.setState({booRCBVisible: false}, 
                () => {
                    this.addFolder();
                }
            );
        },
		delete: () => {
            this.setState({booRCBVisible: false}, 
                () => {
                    this.delete();
                }
            );
        },
	}
    

    constructor(props) {
        super(props);
        this.anable = React.createRef();
        this.state = {
            gData: props.files,
            expandedKeys: [],
            selectedKeys: [],
            
            isAddFile: false,
            isAddFolder: false,
            isRename: false,
            fileName: "",
            blockTitle: "",

            intX: 0,
            intY: 0,
            booRCBVisible: false,
            isSelect: "",
        }

        this.initial();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.focusSpace === 'EditFrame') {
            return {booRCBVisible: false};
        } 
        return {};
    }

    initial = () => {
        setTimeout(() => {
            this.setState({
                selectedKeys: ['file1'],
                expandedKeys: ['folder1']
            })
        })
    }

    finishNaming = () => {
        let data = [...this.state.gData];
        let focusKey = this.state.selectedKeys[0];
        let insertSpace = data;
        let anable = true;
        let index;
        if (focusKey !== undefined) {
            this.findFocus(data, focusKey, (item, i, arr) => {
                console.log(item);
                index = i;
                if (item.isLeaf === false) 
                    insertSpace = item.children;
                else {
                    insertSpace = arr;
                }
            })
        }
        this.checkFileNameAnable(data, this.state.fileName, (result, i) => {
            if (!result && index !== i) {
                alert("名稱重複")
                anable = result;
            }
        })
        if (anable) {
            if (this.state.isRename === true) {
                this.setState({isRename: false}, () => {
                    if (focusKey !== undefined) {
                        this.findFocus(data, focusKey, (item) => {
                            item.title = this.state.fileName;
                            item.key = this.state.fileName;
                        })
                    }
                })
            } else if (this.state.isAddFile === true){
                this.setState({isAddFile: false}, () => {
                    insertSpace.unshift({
                        title: this.state.fileName,
                        key: this.state.fileName,
                        isLeaf:  true,
                        data: '',
                    });
                });
            } else if (this.state.isAddFolder === true) {
                this.setState({isAddFolder: false}, () => {
                    insertSpace.unshift({
                        title: this.state.fileName,
                        key: this.state.fileName,
                        isLeaf:  false,
                        children: [],
                    });
                });
            }
            setTimeout(() => {this.setState({gData: data})}, 0);
        }
    }

    checkFileNameAnable = (data, fileName, callback) => {
        for (let i=0; i<data.length; i++) {
            if (data[i].key === fileName) {
                return callback(false, i);
            }
            if (data[i].children) {
                this.checkFileNameAnable(data[i].children, fileName, callback);
            }
        }
    }

    rename = () => {
        this.setState({isRename: true, fileName: this.state.selectedKeys[0], blockTitle: "重新命名"})
    }

    addFile = () => {
        this.setState({isAddFile: true, fileName: "", blockTitle: "新增檔案"})
    }

    addFolder = () => {
        this.setState({isAddFolder: true, fileName: "", blockTitle: "新增資料夾"})
    }

    delete = () => {
        let data = [...this.state.gData];
        let focusKey = this.state.selectedKeys[0];

        if (focusKey !== undefined) {
            this.findFocus(data, focusKey, (item, i, arr) => {
                arr.splice(i, 1);
            })
        }
        this.setState({gData: data});
    }

    findFocus = (data, key, callback) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].key === key) {
                return callback(data[i], i, data);
            }

            if (data[i].children) {
                this.findFocus(data[i].children, key, callback);
            }
        }
    }

    onRightClick(event) {
        event.preventDefault();
        let focus = event.target.innerHTML;
        if (event.target.title !== "") focus = event.target.title
        this.setState({
            intX: event.pageX,
            intY: event.pageY,
            selectedKeys: [focus],
            booRCBVisible: true,
        })
	}

    onSelect = (keys, event) => {
        const selectedKeys = this.state.selectedKeys;
        const expandedKeys = this.state.expandedKeys;

        let refreshExpand = (key) => {
            if (!expandedKeys.includes(key)) {
                this.setState({expandedKeys: [...expandedKeys, key]});
            } else {
                let array = expandedKeys.filter((value) => {
                    return value !== key
                });
                this.setState({expandedKeys: array});
            }
        }

        if (event.nativeEvent.detail === 1) {
            if (event.nativeEvent.ctrlKey) this.setState({selectedKeys: keys});
            else if (selectedKeys!==[] && selectedKeys.length>keys.length) {
                for (let i=0; i<selectedKeys.length; i++) {
                    if (selectedKeys[i] !== keys[i]) {
                        this.setState({selectedKeys: [selectedKeys[i]]});
                        refreshExpand(selectedKeys[i]);
                        return;
                    }
                }
            } else {
                this.setState({selectedKeys: keys.slice(-1)});
                refreshExpand(keys.slice(-1)[0]);
            }
        } else if (event.nativeEvent.detail === 2){
            this.props.openFile(this.state.selectedKeys[0]);
        }
    }

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
            this.findFocus(data, dropKey, (item) => {
                item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

                item.children.unshift(dragObj);
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

        this.setState({gData: data});
    };

    render() {
        return (
            <div id={'fileBar'}
                onClick={() => this.setState({booRCBVisible: false})}
            >
                <Space size={1} style={{width: "100%"}}>
                    <div className={style.titleName}>{this.props.title}</div>
                    <Button icon={<FileAddOutlined/>} onClick={this.addFile}/>
                    <Button icon={<FolderAddOutlined/>} onClick={this.addFolder}/>
                    <Button icon={<DeleteOutlined/>} onClick={this.delete}/>
                </Space>
                <Divider id={style.divider}/>
                <Tree
                    multiple
                    blockNode
                    showLine={true}
                    showIcon={false}
                    draggable={{icon: false}}
                    rootClassName={style.container}
                    switcherIcon={<DownOutlined />}
                    treeData={this.state.gData}

                    selectedKeys={this.state.selectedKeys}
                    onSelect={this.onSelect}
                    expandedKeys={this.state.expandedKeys}
                    onExpand={(keys) => {this.setState({expandedKeys: keys})}}
                    onDrop={this.onDrop}

                    onContextMenu={this.onRightClick.bind(this)}
                />

                <Modal title={this.state.blockTitle} 
                    onCancel={() => this.setState({isAddFile: false, isAddFolder: false, isRename: false})}
                    onOk={this.finishNaming}
                    open={this.state.isAddFile || this.state.isAddFolder || this.state.isRename}>
                    <Input placeholder={"請輸入名稱..."}
                        maxLength={20}
                        showCount={true}
                        onChange={(event) => this.setState({fileName: event.target.value})}
                        onPressEnter={this.finishNaming}
                        value={this.state.fileName}
                    />
                </Modal>
                <FileRightClickBlock 
					x={this.state.intX} 
					y={this.state.intY} 
					show={this.state.booRCBVisible}
					functions={this.rightClickBlockFunctions}

					isSelect={this.state.selectedKeys[0]}
                    data={this.state.gData}
                    findFocus={this.findFocus}
				/>
            </div>
        );
    }
    
};

export default FileManager;