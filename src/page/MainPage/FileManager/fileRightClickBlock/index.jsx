import React from 'react';
import style from "./index.module.scss"

const listCard = (clickFunction, cardWord, disabled) => {
    return (
        <div className={(disabled)? style.card: style.card_disabled} 
            onClick={clickFunction}
        >{cardWord}</div>
    )
}

class FileRightClickBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            functions: props.functions,

            name: true,
            addFolder: false,
            addFile: false,
            delete: true,
        }
    }

    static getDerivedStateFromProps(props, state) {
        let isFolder = false;
        props.findFocus(props.data, props.isSelect, (item, i, arr) => {
            if (item.isLeaf === false) isFolder = true;
        })
        return {
            addFolder: isFolder,
            addFile: isFolder,
        };
    }

    render() {
        return (
            <div className={style.container}
                style={{left: this.props.x+"px",
                    top: this.props.y+"px",
                    display: (this.props.show === true)? "": "none"}}
            >
                {listCard(this.props.functions.addFolder, "新增資料夾", this.state.addFolder)}
                {listCard(this.props.functions.addFile, "新增檔案", this.state.addFile)}
                {listCard(this.props.functions.rename, "重新命名", this.state.name)}
                {listCard(this.props.functions.delete, "刪除", this.state.delete)}
            </div>
        )
    }
}
export default FileRightClickBlock;
