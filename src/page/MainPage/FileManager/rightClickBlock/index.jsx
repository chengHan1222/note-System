import React from "react";
import style from "./light.module.scss";
import darkStyle from "./dark.module.scss";

class RightClickBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      css: props.style ? darkStyle : style,
      functions: props.functions,

      name: true,
      addFolder: false,
      addFile: false,
      delete: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let isFolder = false;
    props.findFocus(props.data, props.isSelect, (item, i, arr) => {
      if (item.isLeaf === false) isFolder = true;
    });
    return {
      addFolder: isFolder,
      addFile: isFolder,
      css: props.style ? darkStyle : style,
    };
  }

  render() {
    return (
      <div
        className={this.state.css.container}
        style={{
          left: this.props.x + "px",
          top: this.props.y + "px",
          display: this.props.show === true ? "" : "none",
        }}
      >
        {listCard(
          this.props.functions.addFolder,
          "新增資料夾",
          this.state.addFolder,
          this.state.css
        )}
        {listCard(
          this.props.functions.addFile,
          "新增檔案",
          this.state.addFile,
          this.state.css
        )}
        {listCard(
          this.props.functions.rename,
          "重新命名",
          this.state.name,
          this.state.css
        )}
        {listCard(
          this.props.functions.delete,
          "刪除",
          this.state.delete,
          this.state.css
        )}
      </div>
    );
  }
}

const listCard = (clickFunction, cardWord, disabled, css) => {
  return (
    <div
      className={disabled ? css.card : css.card_disabled}
      onClick={clickFunction}
    >
      {cardWord}
    </div>
  );
};

export default RightClickBlock;
