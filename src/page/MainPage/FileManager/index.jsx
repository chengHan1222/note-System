import { Avatar, Button, Card, Divider, Popover, Space, Tree } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DownOutlined,
  FileAddOutlined,
  FolderAddOutlined,
  DeleteOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { Component } from "react";
import { useNavigate } from "react-router-dom";

import "antd/dist/antd.css";
import "./index.css";
import style from "./light.module.scss";
import darkStyle from "./dark.module.scss";
import Swal from "sweetalert2";

import RightClickBlock from "./rightClickBlock";

import UserData from "../../../tools/UserData";
import Controller from "../../../tools/Controller";

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
  oldKey = "";
  constructor(props) {
    super(props);
    this.state = {
      css: props.style ? darkStyle : style,
      gData: props.files,
      expandedKeys: [],
      selectedKeys: [],
      draggable: { icon: false },

      gData: props.files,
      expandedKeys: [],
      selectedKeys: [],
      draggable: { icon: false },

      isNaming: false,
      fileName: "",

      intX: 0,
      intY: 0,
      booRCBVisible: false,
      namingNode: "",

      finishNaming: this.finishNaming,
    };
    this.userData = UserData.getData();
    this.userPic = React.createRef();
    this.imgSrc = "https://joeschmoe.io/api/v1/random";
    this.userContent = (
      <Card
        style={{ width: 300 }}
        actions={[
          <Space
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => {
              Controller.logout();
              this.props.navigation("/");
            }}
          >
            <LogoutOutlined style={{ verticalAlign: "middle" }} />
            <span>登出</span>
          </Space>,
        ]}
      >
        <Meta
          avatar={<Avatar src={this.imgSrc} />}
          title={this.userData[0]}
          description={this.userData[2]}
        />
      </Card>
    );

    this.initial();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.focusSpace === "EditFrame") {
      if (state.isNaming) state.finishNaming();
      return { booRCBVisible: false, css: props.style ? darkStyle : style };
    } else if (props.files !== state.gData) {
      props.setFile(state.gData);
    }
    return { css: props.style ? darkStyle : style };
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

  initial = () => {
    setTimeout(() => {
      this.setState({
        selectedKeys: ["file1"],
        expandedKeys: ["folder_folder1"],
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

    const checkEnable = (data, fileName, isLeaf, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].title === fileName && data[i].isLeaf === isLeaf) {
          return callback(false, i);
        }
        if (data[i].children) {
          checkEnable(data[i].children, fileName, isLeaf, callback);
        }
      }
    };

    const setNodeNormal = () => {
      let namingNode = this.state.namingNode;

      namingNode.contentEditable = "inherit";
      namingNode.classList.remove("naming");
      namingNode.removeEventListener("keydown", this.onKeyDown);
    };

    if (fileName === "") {
      this.delete();
      return;
    }
    if (focusKey !== undefined) {
      this.findFocus(tree, focusKey, (item, index) => {
        focusItem = item;

        checkEnable(tree, fileName, focusItem.isLeaf, (result, i) => {
          if (!result && index !== i) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "名稱重複",
              showConfirmButton: false,
              timer: 1500,
            });
            enable = result;

            if (this.oldKey !== "") {
              let oldTitle = focusItem.isLeaf
                ? this.oldKey
                : this.oldKey.split("_")[1];

              this.setState({ isNaming: false }, () => {
                setNodeNormal();
                this.setDragable(true);
                this.state.namingNode.innerText = oldTitle;
                this.oldKey = "";
              });
            } else {
              this.delete();
              this.setState({ isNaming: false });
            }
          }
        });
      });
      if (enable && this.state.isNaming) {
        let key = focusItem.isLeaf ? fileName : "folder_" + fileName;
        if (!focusItem.isLeaf && expandedKeys.includes(this.oldKey)) {
          expandedKeys = expandedKeys.filter((item) => item !== this.oldKey);
          expandedKeys = [...expandedKeys, key];
        }

        this.setState(
          {
            gData: tree,
            selectedKeys: [key],
            isNaming: false,
            expandedKeys: expandedKeys,
            fileName: "",
          },
          () => {
            setNodeNormal();
            this.setDragable(true);
          }
        );
      }
    }
  };

  rename = () => {
    if (!this.state.isNaming) {
      let selected = this.state.selectedKeys[0];
      this.oldKey = selected;
      selected = selected.includes("_") ? selected.split("_")[1] : selected;
      this.setState({ isNaming: true, fileName: selected }, () => {
        this.insert = true;
        this.setNodeNaming(selected);
        this.setDragable(false);
      });
    }
  };

  addFile = () => {
    if (!this.state.isNaming) {
      let node = { title: "", key: "", isLeaf: true, data: "" };
      this.insertNode(node);
      this.setState(
        { isNaming: true, selectedKeys: [""], fileName: "" },
        () => {
          this.setNodeNaming("");
          this.setDragable(false);
        }
      );
    }
  };

  addFolder = () => {
    if (!this.state.isNaming) {
      let node = { title: "", key: "", isLeaf: false, children: [] };
      this.insertNode(node);
      this.setState(
        { isNaming: true, selectedKeys: [""], fileName: "" },
        () => {
          this.setNodeNaming("");
          this.setDragable(false);
        }
      );
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
    nodeKey = nodeKey.includes("_") ? nodeKey.split("_")[1] : nodeKey;
    let nodes = document.getElementsByClassName(
      "ant-tree-node-content-wrapper"
    );
    let setNode = setInterval(() => {
      if (this.insert) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].title === nodeKey) {
            nodes[i].contentEditable = true;
            nodes[i].classList.add("naming");
            nodes[i].addEventListener("keydown", this.onKeyDown);
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
    if (event.key === "Enter") {
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

    const findFocus = (target, callback) => {
      if (
        target.classList.contains("ant-tree-node-content-wrapper-open") ||
        target.classList.contains("ant-tree-node-content-wrapper-close")
      ) {
        return callback("folder_" + target.title);
      } else if (
        target.classList.contains("ant-tree-node-content-wrapper-normal")
      ) {
        return callback(target.title);
      } else if (!target.classList.contains("ant-tree-treenode")) {
        findFocus(target.parentNode, callback);
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
      if (!event.target.className.includes("ant-tree-node-content-wrapper")) {
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
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

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
  };

  render() {
    return (
      <div
        id={"fileBar"}
        className={this.state.css.fileBlock}
        onClick={this.onClick}
      >
        <Switch
          loading={this.state.isRunning ? true : false}
          style={{
            backgroundColor: this.props.style ? "#006d75" : "#fa8c16",
            fontWeight: "bold",
          }}
          checkedChildren="DARK"
          unCheckedChildren="LIGHT"
          onChange={() => {
            this.props.changeStyle();
            this.setState({ isRunning: true });
            setTimeout(() => this.setState({ isRunning: false }), 3000);
          }}
        />
        <Space className={this.state.css.userBlock}>
          <Popover
            placement="bottomLeft"
            content={this.userContent}
            trigger="click"
          >
            <Space className={this.state.css.userInfo}>
              <Avatar
                ref={this.userPic}
                className={this.state.css.userHead}
                src={this.imgSrc}
              />
              <span className={this.state.css.titleName}>
                {this.userData[0]} 你好
              </span>
            </Space>
          </Popover>

          {React.createElement(ArrowLeftOutlined, {
            className: `${this.state.css.backArrow}`,
            onClick: () => this.props.setCollapsed(!this.props.isCollapsed),
          })}
        </Space>
        <Space size={1} style={{ width: "100%", justifyContent: "end" }}>
          <Button icon={<FileAddOutlined />} onClick={this.addFile} />
          <Button icon={<FolderAddOutlined />} onClick={this.addFolder} />
          <Button icon={<DeleteOutlined />} onClick={this.delete} />
        </Space>
        <Divider id={this.state.css.divider} />
        <Tree
          multiple
          blockNode
          showLine={true}
          showIcon={false}
          draggable={this.state.draggable}
          rootClassName={this.state.css.container}
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
      </div>
    );
  }
}
