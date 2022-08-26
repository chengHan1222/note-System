import React from 'react';
import style from "./index.module.scss"

const listCard = (clickFunction, cardWord) => {
    return (
        <div className={style.card} onClick={clickFunction}>{cardWord}</div>
    )
}

class FileRightClickBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleClick() {

    }

    render() {
        return (
            <div className={style.container}
                style={{left: this.props.x+"px",
                    top: this.props.y+"px",
                    display: (this.props.show === true)? "": "none"}}
            >
                {listCard(this.handleClick, "重新命名")}
                {listCard(this.handleClick, "添加至最愛")}
                {listCard(this.handleClick, "新增檔案")}
                {listCard(this.handleClick, "刪除檔案")}
            </div>
        )
    }
}
export default FileRightClickBlock;
